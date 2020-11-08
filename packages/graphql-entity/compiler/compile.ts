import { GraphQLSchema } from 'graphql/type'
import { DocumentNode } from 'graphql/language'
import { AbsolutePath } from '../lib/path'
import { EntityDocument } from './types'
import { Entity, Enum, RootExtension } from './repr'

export interface CompileParams {
  schema?: GraphQLSchema
  sources: { document: DocumentNode; location: AbsolutePath }[]
}

export interface CompileResult {
  documents: EntityDocument[]
}

export const compile = async ({
  schema: _schema,
  sources,
}: CompileParams): Promise<CompileResult> => {
  const documents: EntityDocument[] = []

  // TODO: For each type in our types map, get definitions from the schema
  for (const { document, location } of sources) {
    const entities: Entity[] = []
    const enums: Enum[] = []
    const rootExtensions: RootExtension[] = []

    for (const definition of document.definitions) {
      switch (definition.kind) {
        case 'ObjectTypeDefinition':
          entities.push(Entity.fromObjectType(definition))
          break
        case 'ObjectTypeExtension':
          rootExtensions.push(...RootExtension.fromObjectTypeExtension(definition))
          break
        case 'EnumTypeDefinition':
          enums.push(Enum.fromEnum(definition))
          break
        default: {
          // TODO: Handle other definitions
        }
      }
    }

    documents.push({
      entities,
      enums,
      location,
      rootExtensions,
    })
  }

  return {
    documents,
  }
}