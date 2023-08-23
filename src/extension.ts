import * as vscode from "vscode";
import * as provider from "./provider";

export function activate(context: vscode.ExtensionContext) {
  let definitionProvider: provider.PeekFileDefinitionProvider | undefined;
  let implementationProvider: provider.PeekFileImplementationProvider | undefined;
  let declarationProvider: provider.PeekFileDeclarationProvider | undefined;

  let peekFilter: vscode.DocumentFilter[] = [];

  function updateProviders() {
    if (definitionProvider) {
      definitionProvider.dispose();
    }
    if (implementationProvider) {
      implementationProvider.dispose();
    }
    if (declarationProvider) {
      declarationProvider.dispose();
    }

    const config = vscode.workspace.getConfiguration("vscode_peek");
    const activeLanguages = config.get("activeLanguages") as string[];
    const definitionFilePatterns = config.get("definitionFilePatterns") as vscode.GlobPattern[];
    const definitionMatchPattern = config.get("definitionMatchPattern") as string;
    const implementationFilePatterns = config.get("ImplementationFilePatterns") as vscode.GlobPattern[];
    const implementationMatchPattern = config.get("ImplementationMatchPattern") as string;
    const declarationFilePatterns = config.get("declarationFilePatterns") as vscode.GlobPattern[];
    const declarationMatchPattern = config.get("declarationMatchPattern") as string;

    peekFilter = activeLanguages.map((language) => ({
      language,
      scheme: "file",
    }));

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
      vscode.languages.registerDefinitionProvider(peekFilter, definitionProvider)
    );

    context.subscriptions.push(
      vscode.languages.registerImplementationProvider(peekFilter, implementationProvider)
    );

    context.subscriptions.push(
      vscode.languages.registerDeclarationProvider(peekFilter, declarationProvider)
    );
  }

  updateProviders();

  // 监听设置文件修改事件
  vscode.workspace.onDidChangeConfiguration((event) => {
    if (event.affectsConfiguration("vscode_peek")) {
      updateProviders();
    }
  });

  console.log("Extension activated");
}

export function deactivate() {
  console.log("Extension deactivated");
}