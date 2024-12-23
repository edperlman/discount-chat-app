"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusCode = exports.defaultAuthnContext = exports.defaultIdentifierFormat = exports.defaultNameIDTemplate = exports.defaultMetadataTemplate = exports.defaultMetadataCertificateTemplate = exports.defaultLogoutRequestTemplate = exports.defaultLogoutResponseTemplate = exports.defaultAuthRequestTemplate = exports.defaultAuthnContextTemplate = void 0;
exports.defaultAuthnContextTemplate = `<samlp:RequestedAuthnContext xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol" Comparison="__authnContextComparison__">
  <saml:AuthnContextClassRef xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion">
    __authnContext__
  </saml:AuthnContextClassRef>
</samlp:RequestedAuthnContext>`;
exports.defaultAuthRequestTemplate = `<samlp:AuthnRequest xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol" ID="__newId__" Version="2.0" IssueInstant="__instant__" ProtocolBinding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" AssertionConsumerServiceURL="__callbackUrl__" Destination="__entryPoint__">
  <saml:Issuer xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion">__issuer__</saml:Issuer>
  __identifierFormatTag__
  __authnContextTag__
</samlp:AuthnRequest>`;
exports.defaultLogoutResponseTemplate = `<samlp:LogoutResponse xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol" ID="__inResponseToId__" Version="2.0" IssueInstant="__instant__" Destination="__idpSLORedirectURL__">
  <saml:Issuer xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion">__issuer__</saml:Issuer>
  <samlp:Status><samlp:StatusCode Value="urn:oasis:names:tc:SAML:2.0:status:Success"/></samlp:Status>
</samlp:LogoutResponse>`;
exports.defaultLogoutRequestTemplate = `<samlp:LogoutRequest xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol" ID="__newId__" Version="2.0" IssueInstant="__instant__" Destination="__idpSLORedirectURL__">
  <saml:Issuer xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion">__issuer__</saml:Issuer>
  <saml:NameID xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion" NameQualifier="http://id.init8.net:8080/openam" SPNameQualifier="__issuer__" Format="__identifierFormat__">__nameID__</saml:NameID>
  <samlp:SessionIndex xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol">__sessionIndex__</samlp:SessionIndex>
</samlp:LogoutRequest>`;
exports.defaultMetadataCertificateTemplate = `
    <KeyDescriptor>
      <ds:KeyInfo>
        <ds:X509Data>
          <ds:X509Certificate>__certificate__</ds:X509Certificate>
        </ds:X509Data>
      </ds:KeyInfo>
      <EncryptionMethod Algorithm="http://www.w3.org/2001/04/xmlenc#aes256-cbc"/>
      <EncryptionMethod Algorithm="http://www.w3.org/2001/04/xmlenc#aes128-cbc"/>
      <EncryptionMethod Algorithm="http://www.w3.org/2001/04/xmlenc#tripledes-cbc"/>
    </KeyDescriptor>`;
exports.defaultMetadataTemplate = `<?xml version="1.0"?>
<EntityDescriptor xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="urn:oasis:names:tc:SAML:2.0:metadata https://docs.oasis-open.org/security/saml/v2.0/saml-schema-metadata-2.0.xsd" xmlns="urn:oasis:names:tc:SAML:2.0:metadata" xmlns:ds="http://www.w3.org/2000/09/xmldsig#" entityID="__issuer__">
  <SPSSODescriptor protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">__certificateTag__
    <SingleLogoutService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect" Location="__sloLocation__" ResponseLocation="__sloLocation__"/>
    <NameIDFormat>__identifierFormat__</NameIDFormat>
    <AssertionConsumerService index="1" isDefault="true" Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" Location="__callbackUrl__"/>
  </SPSSODescriptor>
</EntityDescriptor>`;
exports.defaultNameIDTemplate = '<samlp:NameIDPolicy xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol" Format="__identifierFormat__" AllowCreate="true"></samlp:NameIDPolicy>';
exports.defaultIdentifierFormat = 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress';
exports.defaultAuthnContext = 'urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport';
exports.StatusCode = {
    success: 'urn:oasis:names:tc:SAML:2.0:status:Success',
    responder: 'urn:oasis:names:tc:SAML:2.0:status:Responder',
};
