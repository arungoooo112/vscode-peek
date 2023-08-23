import * as vscode from "vscode";

class PeekFileBaseProvider implements vscode.DefinitionProvider, vscode.ImplementationProvider, vscode.DeclarationProvider, vscode.Disposable {
  protected locations: Map<string, vscode.Location[]>;
  protected matchPattern: RegExp;
  protected searchFiles: vscode.Uri[];
  private disposables: vscode.Disposable[];

  constructor(filePatterns: vscode.GlobPattern[], matchPattern: string) {
    this.locations = new Map<string, vscode.Location[]>();
    this.matchPattern = new RegExp(matchPattern, "i");
    this.searchFiles = [];
    this.disposables = [];
    this.findFiles(filePatterns).then((files) => {
      this.searchFiles = files;
    });
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

  private async findFiles(filePatterns: vscode.GlobPattern[]): Promise<vscode.Uri[]> {
    const patternFilesPromises = filePatterns.map((pattern) => {
      return vscode.workspace.findFiles(pattern);
    });
    const patternFilesArrays = await Promise.all(patternFilesPromises);
    const files = patternFilesArrays.flat();
    return files;
  }

  private async provide(document: vscode.TextDocument, position: vscode.Position): Promise<vscode.Location[]> {
    const word = document.getText(document.getWordRangeAtPosition(position));
    if (this.locations.has(word)) {
      return this.locations.get(word) ?? [];
    }
    this.matchPattern = new RegExp(this.matchPattern.source.replace(/{word}/i, word), "i");
    for (const file of this.searchFiles) {
      await this.handleFile(file, word);
    }
    return this.locations.get(word) ?? [];
  }

  provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Promise<vscode.Location[]> {
    return this.provide(document, position);
  }

  provideImplementation(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Promise<vscode.Location[]> {
    return this.provide(document, position);
  }

  provideDeclaration(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Promise<vscode.Location[]> {
    return this.provide(document, position);
  }

  updateFilePatterns(filePatterns: vscode.GlobPattern[]): void {
    this.searchFiles = [];
    this.findFiles(filePatterns).then((files) => {
      this.searchFiles = files;
    });
  }

  updateMatchPattern(matchPattern: string): void {
    this.matchPattern = new RegExp(matchPattern, "i");
  }

  dispose(): void {
    for (const disposable of this.disposables) {
      disposable.dispose();
    }
    this.disposables = [];
  }
}

export class PeekFileDefinitionProvider extends PeekFileBaseProvider {
  constructor(filePatterns: vscode.GlobPattern[], matchPattern: string) {
    super(filePatterns, matchPattern);
  }

  updateFilePatterns(filePatterns: vscode.GlobPattern[]): void {
    super.updateFilePatterns(filePatterns);
  }

  updateMatchPattern(matchPattern: string): void {
    super.updateMatchPattern(matchPattern);
  }
}

export class PeekFileImplementationProvider extends PeekFileBaseProvider {
  constructor(filePatterns: vscode.GlobPattern[], matchPattern: string) {
    super(filePatterns, matchPattern);
  }

  updateFilePatterns(filePatterns: vscode.GlobPattern[]): void {
    super.updateFilePatterns(filePatterns);
  }

  updateMatchPattern(matchPattern: string): void {
    super.updateMatchPattern(matchPattern);
  }
}

export class PeekFileDeclarationProvider extends PeekFileBaseProvider {
  constructor(filePatterns: vscode.GlobPattern[], matchPattern: string) {
    super(filePatterns, matchPattern);
  }

  updateFilePatterns(filePatterns: vscode.GlobPattern[]): void {
    super.updateFilePatterns(filePatterns);
  }

  updateMatchPattern(matchPattern: string): void {
    super.updateMatchPattern(matchPattern);
  }
}