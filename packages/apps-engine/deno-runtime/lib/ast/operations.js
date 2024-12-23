"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixRoomUsernamesCalls = exports.fixLivechatIsOnlineCalls = exports.checkReassignmentOfModifiedIdentifiers = void 0;
exports.getFunctionIdentifier = getFunctionIdentifier;
exports.wrapWithAwait = wrapWithAwait;
exports.asyncifyScope = asyncifyScope;
exports.buildFixModifiedFunctionsOperation = buildFixModifiedFunctionsOperation;
function getFunctionIdentifier(ancestors, functionNodeIndex) {
    var _a;
    const parent = ancestors[functionNodeIndex - 1];
    // If there is a parent node and it's not a computed property, we can try to
    // extract an identifier for our function from it. This needs to be done first
    // because when functions are assigned to named symbols, this will be the only
    // way to call it, even if the function itself has an identifier
    // Consider the following block:
    //
    // const foo = function bar() {}
    //
    // Even though the function itself has a name, the only way to call it in the
    // program is wiht `foo()`
    if (parent && !parent.computed) {
        // Several node types can have an id prop of type Identifier
        const { id } = parent;
        if ((id === null || id === void 0 ? void 0 : id.type) === 'Identifier') {
            return id.name;
        }
        // Usually assignments to object properties (MethodDefinition, Property)
        const { key } = parent;
        if ((key === null || key === void 0 ? void 0 : key.type) === 'Identifier') {
            return key.name;
        }
        // Variable assignments have left hand side that can be used as Identifier
        const { left } = parent;
        // Simple assignment: `const fn = () => {}`
        if ((left === null || left === void 0 ? void 0 : left.type) === 'Identifier') {
            return left.name;
        }
        // Object property assignment: `obj.fn = () => {}`
        if ((left === null || left === void 0 ? void 0 : left.type) === 'MemberExpression' && !left.computed) {
            return left.property.name;
        }
    }
    // nodeIndex needs to be the index of a Function node (either FunctionDeclaration or FunctionExpression)
    const currentNode = ancestors[functionNodeIndex];
    // Function declarations or expressions can be directly named
    if (((_a = currentNode.id) === null || _a === void 0 ? void 0 : _a.type) === 'Identifier') {
        return currentNode.id.name;
    }
}
function wrapWithAwait(node) {
    if (!node.type.endsWith('Expression')) {
        throw new Error(`Can't wrap "${node.type}" with await`);
    }
    const innerNode = Object.assign({}, node);
    node.type = 'AwaitExpression';
    // starting here node has become an AwaitExpression
    node.argument = innerNode;
    Object.keys(node).forEach((key) => !['type', 'argument'].includes(key) && delete node[key]);
}
function asyncifyScope(ancestors, state) {
    const functionNodeIndex = ancestors.findLastIndex((n) => 'async' in n);
    if (functionNodeIndex === -1)
        return;
    // At this point this is a node with an "async" property, so it has to be
    // of type Function - let TS know about that
    const functionScopeNode = ancestors[functionNodeIndex];
    if (functionScopeNode.async) {
        return;
    }
    functionScopeNode.async = true;
    // If the parent of a function node is a call expression, we're talking about an IIFE
    // Should we care about this case as well?
    // const parentNode = ancestors[functionScopeIndex-1];
    // if (parentNode?.type === 'CallExpression' && ancestors[functionScopeIndex-2] && ancestors[functionScopeIndex-2].type !== 'AwaitExpression') {
    //   pendingOperations.push(buildFunctionPredicate(getFunctionIdentifier(ancestors, functionScopeIndex-2)));
    // }
    const identifier = getFunctionIdentifier(ancestors, functionNodeIndex);
    // We can't fix calls of functions which name we can't determine at compile time
    if (!identifier)
        return;
    state.functionIdentifiers.add(identifier);
}
function buildFixModifiedFunctionsOperation(functionIdentifiers) {
    return function _fixModifiedFunctionsOperation(node, state, ancestors) {
        var _a;
        if (node.type !== 'CallExpression')
            return;
        let isWrappable = false;
        // This node is a simple call to a function, like `fn()`
        isWrappable = node.callee.type === 'Identifier' && functionIdentifiers.has(node.callee.name);
        // This node is a call to an object property or instance method, like `obj.fn()`, but not computed like `obj[fn]()`
        isWrappable || (isWrappable = node.callee.type === 'MemberExpression' &&
            !node.callee.computed &&
            ((_a = node.callee.property) === null || _a === void 0 ? void 0 : _a.type) === 'Identifier' &&
            functionIdentifiers.has(node.callee.property.name));
        // This is a weird dereferencing technique used by bundlers, and since we'll be dealing with bundled sources we have to check for it
        // e.g. `r=(0,fn)(e)`
        if (!isWrappable && node.callee.type === 'SequenceExpression') {
            const [, secondExpression] = node.callee.expressions;
            isWrappable = (secondExpression === null || secondExpression === void 0 ? void 0 : secondExpression.type) === 'Identifier' && functionIdentifiers.has(secondExpression.name);
            isWrappable || (isWrappable = (secondExpression === null || secondExpression === void 0 ? void 0 : secondExpression.type) === 'MemberExpression' &&
                !secondExpression.computed &&
                secondExpression.property.type === 'Identifier' &&
                functionIdentifiers.has(secondExpression.property.name));
        }
        if (!isWrappable)
            return;
        // ancestors[ancestors.length-1] === node, so here we're checking for parent node
        const parentNode = ancestors[ancestors.length - 2];
        if (!parentNode || parentNode.type === 'AwaitExpression')
            return;
        wrapWithAwait(node);
        asyncifyScope(ancestors, state);
        state.isModified = true;
    };
}
const checkReassignmentOfModifiedIdentifiers = (node, { functionIdentifiers }, _ancestors) => {
    var _a, _b, _c;
    if (node.type === 'AssignmentExpression') {
        if (node.operator !== '=')
            return;
        let identifier = '';
        if (node.left.type === 'Identifier')
            identifier = node.left.name;
        if (node.left.type === 'MemberExpression' && !node.left.computed) {
            identifier = node.left.property.name;
        }
        if (!identifier || node.right.type !== 'Identifier' || !functionIdentifiers.has(node.right.name))
            return;
        functionIdentifiers.add(identifier);
        return;
    }
    if (node.type === 'VariableDeclarator') {
        if (node.id.type !== 'Identifier' || functionIdentifiers.has(node.id.name))
            return;
        if (((_a = node.init) === null || _a === void 0 ? void 0 : _a.type) !== 'Identifier' || !functionIdentifiers.has((_b = node.init) === null || _b === void 0 ? void 0 : _b.name))
            return;
        functionIdentifiers.add(node.id.name);
        return;
    }
    // "Property" is for plain objects, "PropertyDefinition" is for classes
    // but both share the same structure
    if (node.type === 'Property' || node.type === 'PropertyDefinition') {
        if (node.key.type !== 'Identifier' || functionIdentifiers.has(node.key.name))
            return;
        if (((_c = node.value) === null || _c === void 0 ? void 0 : _c.type) !== 'Identifier' || !functionIdentifiers.has(node.value.name))
            return;
        functionIdentifiers.add(node.key.name);
        return;
    }
};
exports.checkReassignmentOfModifiedIdentifiers = checkReassignmentOfModifiedIdentifiers;
const fixLivechatIsOnlineCalls = (node, state, ancestors) => {
    if (node.type !== 'MemberExpression' || node.computed)
        return;
    if (node.property.name !== 'isOnline')
        return;
    if (node.object.type !== 'CallExpression')
        return;
    if (node.object.callee.type !== 'MemberExpression')
        return;
    if (node.object.callee.property.name !== 'getLivechatReader')
        return;
    let parentIndex = ancestors.length - 2;
    let targetNode = ancestors[parentIndex];
    if (targetNode.type !== 'CallExpression') {
        targetNode = node;
    }
    else {
        parentIndex--;
    }
    // If we're already wrapped with an await, nothing to do
    if (ancestors[parentIndex].type === 'AwaitExpression')
        return;
    // If we're in the middle of a chained member access, we can't wrap with await
    if (ancestors[parentIndex].type === 'MemberExpression')
        return;
    wrapWithAwait(targetNode);
    asyncifyScope(ancestors, state);
    state.isModified = true;
};
exports.fixLivechatIsOnlineCalls = fixLivechatIsOnlineCalls;
const fixRoomUsernamesCalls = (node, state, ancestors) => {
    if (node.type !== 'MemberExpression' || node.computed)
        return;
    if (node.property.name !== 'usernames')
        return;
    let parentIndex = ancestors.length - 2;
    let targetNode = ancestors[parentIndex];
    if (targetNode.type !== 'CallExpression') {
        targetNode = node;
    }
    else {
        parentIndex--;
    }
    // If we're already wrapped with an await, nothing to do
    if (ancestors[parentIndex].type === 'AwaitExpression')
        return;
    wrapWithAwait(targetNode);
    asyncifyScope(ancestors, state);
    state.isModified = true;
};
exports.fixRoomUsernamesCalls = fixRoomUsernamesCalls;
