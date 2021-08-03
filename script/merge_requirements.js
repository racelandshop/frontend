const fs = require("fs");

let rawcore = fs.readFileSync("./homeassistant-frontend/package.json");
let rawracelandshop = fs.readFileSync("./package.json");

const core = JSON.parse(rawcore);
const racelandshop = JSON.parse(rawracelandshop);

fs.writeFileSync(
  "./package.json",
  JSON.stringify(
    {
      ...racelandshop,
      resolutions: { ...core.resolutions },
      dependencies: { ...core.dependencies, ...racelandshop.dependenciesOverride },
      devDependencies: { ...core.devDependencies, ...racelandshop.devDependenciesOverride },
    },
    null,
    2
  )
);
