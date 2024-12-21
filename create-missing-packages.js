const fs = require("fs");
const path = require("path");

// Path to the meteor package.json file
const meteorPackagePath = path.join(__dirname, "apps", "meteor", "package.json");
const packagesDir = path.join(__dirname, "packages");

// Read the meteor package.json
const meteorPackageJson = JSON.parse(fs.readFileSync(meteorPackagePath, "utf-8"));

// Combine dependencies and devDependencies with @rocket.chat/* prefix
const dependencies = [
  ...Object.keys(meteorPackageJson.dependencies || {}).filter((dep) =>
    dep.startsWith("@rocket.chat/")
  ),
  ...Object.keys(meteorPackageJson.devDependencies || {}).filter((dep) =>
    dep.startsWith("@rocket.chat/")
  ),
];

// Create missing packages
dependencies.forEach((dep) => {
  const packageName = dep.replace("@rocket.chat/", "");
  const packageDir = path.join(packagesDir, packageName);

  // Check if the folder already exists
  if (!fs.existsSync(packageDir)) {
    // Create the directory
    fs.mkdirSync(packageDir, { recursive: true });

    // Create a basic package.json
    const packageJson = {
      name: dep,
      version: "1.0.0",
      private: true,
      description: `Auto-generated package.json for ${dep}`,
      dependencies: {},
    };

    fs.writeFileSync(
      path.join(packageDir, "package.json"),
      JSON.stringify(packageJson, null, 2)
    );

    console.log(`Created package for ${dep}`);
  }
});
