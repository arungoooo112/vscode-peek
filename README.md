# vscode_peek

This is the README for the `vscode_peek` extension. Here is a description of the extension and instructions on how to use it.

## Features

The `vscode_peek` extension provides peek functionality for definitions, implementations, and declarations in Visual Studio Code. It allows you to quickly navigate to the source code of symbols within your workspace.

## Requirements

There are no specific requirements or dependencies for this extension.

## Extension Settings

The `vscode_peek` extension contributes the following settings:

- `vscode_peek.activeLanguages`: An array of languages for which the peek functionality should be enabled.
- `vscode_peek.definitionFilePatterns`: An array of file patterns to search for when providing definition peek.
- `vscode_peek.definitionMatchPattern`: A regular expression pattern used to match the definition within a file.
- `vscode_peek.implementationFilePatterns`: An array of file patterns to search for when providing implementation peek.
- `vscode_peek.implementationMatchPattern`: A regular expression pattern used to match the implementation within a file.
- `vscode_peek.declarationFilePatterns`: An array of file patterns to search for when providing declaration peek.
- `vscode_peek.declarationMatchPattern`: A regular expression pattern used to match the declaration within a file.

## Usage

1. Install the `vscode_peek` extension.
1. Configure the extension settings in your Visual Studio Code workspace settings.
1. Open a file in your workspace.
1. Place the cursor on a symbol (e.g., a function, class, or variable) that you want to peek.
1. Use the appropriate keyboard shortcut (depends on your platform) or right-click and select the desired peek option from the context menu.
1. The extension will search for the symbol in the specified file patterns and display the corresponding locations where the symbol is defined, implemented, or declared.

## Known Issues

There are no known issues with this extension.

## Release Notes

### 1.0.0

- Initial release of the `vscode_peek` extension.

### 1.1.0

- Added support for multiple programming languages.
- Improved performance and reliability.

______________________________________________________________________

## Contribution

Contributions to the `vscode_peek` extension are welcome. Please follow the [contribution guidelines](CONTRIBUTING.md) when making contributions.

## License

This extension is licensed under the [MIT License](LICENSE).

**Enjoy!**