import * as vscode from "vscode";

class PeekFileBaseProvider {
  protected locations: Map<string, vscode.Location[]>;
  protected matchPattern: RegExp;
  protected searchFiles: vscode.Uri[];

  constructor(filePatterns: vscode.GlobPattern[], matchPattern: string) {
    this.locations = new Map<string, vscode.Location[]>();
    this.matchPattern = new RegExp(matchPattern, 'i');
    this.searchFiles = [];
    this.findFiles(filePatterns).then((files) => this.searchFiles = files);
  }

  private async handleFile(file: vscode.Uri, word: string) {
    try {
      const fileContentBytes = await vscode.workspace.fs.readFile(file);
      const fileContent = Buffer.from(fileContentBytes).toString("utf8");
      if (this.matchPattern.test(fileContent)) {
        this.locations.set(word, [new vscode.Location(file, new vscode.Position(0, 0))]);
      }
    } catch (error) {
      console.error(`Error reading file: ${file.fsPath}`, error);
    }
  }

  private async traverseFiles(word: string): Promise<vscode.Location[]>{
    for (const file of this.searchFiles) {
      await this.handleFile(file, word);
    }
    return this.locations.get(word) ?? [];
  }

  private async findFiles(filePatterns: vscode.GlobPattern[]): Promise<vscode.Uri[]> {
    const patternFilesPromises = filePatterns.map((pattern) => {
      return vscode.workspace.findFiles(pattern);
    });
    const patternFilesArrays = await Promise.all(patternFilesPromises);
    const files = patternFilesArrays.flat();
    return files;
  }

  protected async provide(document: vscode.TextDocument,
    position: vscode.Position): Promise<vscode.Location[]> {
    const word = document.getText(document.getWordRangeAtPosition(position));
    if (this.locations.has(word)) {
      return this.locations.get(word) ?? [];
    }
    this.matchPattern = new RegExp(
      this.matchPattern.source.replace(/{word}/i, word), 'i'
    );
    return this.traverseFiles(word);
  }
}

export class PeekFileDefinitionProvider
  extends PeekFileBaseProvider
  implements vscode.DefinitionProvider {
  async provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Promise<vscode.Location[]> {
    return this.provide(document, position);
  }
}

export class PeekFileImplementationProvider
  extends PeekFileBaseProvider
  implements vscode.ImplementationProvider {
  async provideImplementation(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Promise<vscode.Location[]> {
    return this.provide(document, position);
  }
}

export class PeekFileDeclarationProvider
  extends PeekFileBaseProvider
  implements vscode.DeclarationProvider {
  async provideDeclaration(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Promise<vscode.Location[]> {
    return this.provide(document, position);
  }
}
