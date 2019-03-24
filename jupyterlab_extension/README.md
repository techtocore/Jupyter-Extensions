# About

This extension replaces all the "SWAN" strings which are located inside markdown cells (inside a Jupyter Lab NB) with the SWAN logo.

![Screenshot image](snip.jpg)

## Prerequisites

- JupyterLab
- Node.js

## Development

For a development install (requires npm version 4 or later), do the following in the repository directory:

```bash
npm install
npm run build
jupyter labextension link .
```

To rebuild the package and the JupyterLab app:

```bash
npm run build
jupyter lab build
```

## Known Bugs

- The markdown cell is not readly editable once it is rendered. For now, the type should be changed to be made editable. The type can be restored afterwards and rendered once again.
