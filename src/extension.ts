import * as vscode from "vscode";
import * as provider from './provider';

let definitionProvider: provider.PeekFileDefinitionProvider | undefined;
let implementationProvider: provider.PeekFileImplementationProvider | undefined;
let declarationProvider: provider.PeekFileDeclarationProvider | undefined;

export function activate(context: vscode.ExtensionContext) {
  const config = vscode.workspace.getConfiguration("vscode_peek");
  const activeLanguages = config.get("activeLanguages") as string[];

  function registerProviders() {
    if (definitionProvider) {
      definitionProvider.dispose();
    }
    if (implementationProvider) {
      implementationProvider.dispose();
    }
    if (declarationProvider) {
      declarationProvider.dispose();
    }

    const definitionFilePatterns = config.get(
      "definitionFilePatterns"
    ) as vscode.GlobPattern[];
    const definitionMatchPattern = config.get(
      "definitionMatchPattern"
    ) as string;

    const implementationFilePatterns = config.get(
      "ImplementationFilePatterns"
    ) as vscode.GlobPattern[];
    const implementationMatchPattern = config.get(
      "ImplementationMatchPattern"
    ) as string;

    const declarationFilePatterns = config.get(
      "declarationFilePatterns"
    ) as vscode.GlobPattern[];
    const declarationMatchPattern = config.get(
      "declarationMatchPattern"
    ) as string;

    const peekFilter: vscode.DocumentFilter[] = activeLanguages.map(
      (language) => ({
        language,
        scheme: "file",
      })
    );

    definitionProvider = new provider.PeekFileDefinitionProvider(
      definitionFilePatterns,
      definitionMatchPattern
    );
    implementationProvider = new provider.PeekFileImplementationProvider(
      implementationFilePatterns,
      implementationMatchPattern
    );
    declarationProvider = new provider.PeekFileDeclarationProvider(
      declarationFilePatterns,
      declarationMatchPattern
    );

    context.subscriptions.push(
      vscode.languages.registerDefinitionProvider(
        peekFilter,
        definitionProvider
      )
    );

    context.subscriptions.push(
      vscode.languages.registerImplementationProvider(
        peekFilter,
        implementationProvider
      )
    );

    context.subscriptions.push(
      vscode.languages.registerDeclarationProvider(
        peekFilter,
        declarationProvider
      )
    );
  }

  registerProviders();

  // Listen for configuration changes
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration("vscode_peek")) {
        config.update().then(registerProviders);
      }
    })
  );

  console.log("Extension activated");
}

export function deactivate() {
  if (definitionProvider) {
    definitionProvider.dispose();
  }
  if (implementationProvider) {
    implementationProvider.dispose();
  }
  if (declarationProvider) {
    declarationProvider.dispose();
  }

  console.log("Extension deactivated");
}
