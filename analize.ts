import * as ts from "typescript"

function assertIsNotUndefined<T>(x: T | undefined): asserts x is T {
  if (x === undefined) {
    throw new TypeError("unexpected undefined")
  }
}

const filename = "src/api.ts"
const compilerOptions: ts.CompilerOptions = {}
const program: ts.Program = ts.createProgram([filename], compilerOptions)
const sourceFile: ts.SourceFile | undefined = program.getSourceFile(filename)
assertIsNotUndefined(sourceFile)

function findSearchDeclaration(
  node: ts.Node
): ts.FunctionDeclaration | undefined {
  if (
    ts.isFunctionDeclaration(node) &&
    node.name !== undefined &&
    ts.idText(node.name) === "search"
  ) {
    return node
  }

  return ts.forEachChild(node, findSearchDeclaration)
}

const searchDecl = ts.forEachChild(sourceFile, findSearchDeclaration)
assertIsNotUndefined(searchDecl)

const printer: ts.Printer = ts.createPrinter()
console.log("declaration of search")
console.log(printer.printNode(ts.EmitHint.Unspecified, searchDecl, sourceFile))

const checker: ts.TypeChecker = program.getTypeChecker()
assertIsNotUndefined(searchDecl.type)
const returnType: ts.Type | undefined = checker.getTypeAtLocation(
  searchDecl.type
)
assertIsNotUndefined(returnType)

const symbol: ts.Symbol | undefined = returnType.getSymbol()
assertIsNotUndefined(symbol)

const typeDecls: ts.Declaration[] | undefined = symbol.getDeclarations()
assertIsNotUndefined(typeDecls)
console.log("declarations of return type of search")
console.log(
  printer.printList(
    ts.ListFormat.MultiLine | ts.ListFormat.NoTrailingNewLine,
    ts.factory.createNodeArray(typeDecls),
    sourceFile
  )
)
