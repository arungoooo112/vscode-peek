import * as vscode from "vscode";
import * as provider from './provider';

export function activate(context: vscode.ExtensionContext) {
  const config = vscode.workspace.getConfiguration("vscode_peek");
  const activeLanguages = config.get("activeLanguages") as string[];

  const definitionFilePatterns = config.get(
    "definitionFilePatterns"
  ) as vscode.GlobPattern[];
  const definitionMatchPattern = config.get(
    "definitionMatchPattern") as string;

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

  context.subscriptions.push(
    vscode.languages.registerDefinitionProvider(
      peekFilter,
      new provider.PeekFileDefinitionProvider(
        definitionFilePatterns,
        definitionMatchPattern
      )
    )
  );

  context.subscriptions.push(
    vscode.languages.registerImplementationProvider(
      peekFilter,
      new provider.PeekFileImplementationProvider(
        implementationFilePatterns,
        implementationMatchPattern
      )
    )
  );

  context.subscriptions.push(
    vscode.languages.registerDeclarationProvider(
      peekFilter,
      new provider.PeekFileDeclarationProvider(
        declarationFilePatterns,
        declarationMatchPattern
      )
    )
  );

  console.log("Extension activated");
}

export function deactivate() {
  console.log("Extension deactivated");
}