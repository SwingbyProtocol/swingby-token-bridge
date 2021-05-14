/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */


import { MyContextType } from "./src/modules/model/context"
import { Decimal } from "@prisma/client/runtime"
import { core } from "nexus"
declare global {
  interface NexusGenCustomInputMethods<TypeName extends string> {
    /**
     * A number without precision limits.
     */
    decimal<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "Decimal";
    /**
     * A timestamp.
     */
    dateTime<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "DateTime";
  }
}
declare global {
  interface NexusGenCustomOutputMethods<TypeName extends string> {
    /**
     * A number without precision limits.
     */
    decimal<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "Decimal";
    /**
     * A timestamp.
     */
    dateTime<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "DateTime";
  }
}
declare global {
  interface NexusGenCustomOutputProperties<TypeName extends string> {
    model: NexusPrisma<TypeName, 'model'>
    crud: any
  }
}

declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
  DateTimeFilter: { // input type
    equals?: NexusGenScalars['DateTime'] | null; // DateTime
    gt?: NexusGenScalars['DateTime'] | null; // DateTime
    gte?: NexusGenScalars['DateTime'] | null; // DateTime
    in?: Array<NexusGenScalars['DateTime'] | null> | null; // [DateTime]
    lt?: NexusGenScalars['DateTime'] | null; // DateTime
    lte?: NexusGenScalars['DateTime'] | null; // DateTime
    not?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
    notIn?: Array<NexusGenScalars['DateTime'] | null> | null; // [DateTime]
  }
  DecimalFilter: { // input type
    equals?: NexusGenScalars['Decimal'] | null; // Decimal
    gt?: NexusGenScalars['Decimal'] | null; // Decimal
    gte?: NexusGenScalars['Decimal'] | null; // Decimal
    in?: Array<NexusGenScalars['Decimal'] | null> | null; // [Decimal]
    lt?: NexusGenScalars['Decimal'] | null; // Decimal
    lte?: NexusGenScalars['Decimal'] | null; // Decimal
    not?: NexusGenInputs['DecimalFilter'] | null; // DecimalFilter
    notIn?: Array<NexusGenScalars['Decimal'] | null> | null; // [Decimal]
  }
  DepositWhereInput: { // input type
    AND?: Array<NexusGenInputs['DepositWhereInput'] | null> | null; // [DepositWhereInput]
    NOT?: Array<NexusGenInputs['DepositWhereInput'] | null> | null; // [DepositWhereInput]
    OR?: Array<NexusGenInputs['DepositWhereInput'] | null> | null; // [DepositWhereInput]
    addressContract?: NexusGenInputs['StringFilter'] | null; // StringFilter
    addressFrom?: NexusGenInputs['StringFilter'] | null; // StringFilter
    addressTo?: NexusGenInputs['StringFilter'] | null; // StringFilter
    at?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
    blockNumber?: NexusGenInputs['DecimalFilter'] | null; // DecimalFilter
    createdAt?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
    gas?: NexusGenInputs['DecimalFilter'] | null; // DecimalFilter
    gasPrice?: NexusGenInputs['DecimalFilter'] | null; // DecimalFilter
    hash?: NexusGenInputs['StringFilter'] | null; // StringFilter
    network?: NexusGenInputs['NetworkFilter'] | null; // NetworkFilter
    tokenDecimals?: NexusGenInputs['IntFilter'] | null; // IntFilter
    transactionIndex?: NexusGenInputs['IntFilter'] | null; // IntFilter
    updatedAt?: NexusGenInputs['DateTimeFilter'] | null; // DateTimeFilter
    value?: NexusGenInputs['DecimalFilter'] | null; // DecimalFilter
  }
  IntFilter: { // input type
    equals?: number | null; // Int
    gt?: number | null; // Int
    gte?: number | null; // Int
    in?: Array<number | null> | null; // [Int]
    lt?: number | null; // Int
    lte?: number | null; // Int
    not?: NexusGenInputs['IntFilter'] | null; // IntFilter
    notIn?: Array<number | null> | null; // [Int]
  }
  NetworkFilter: { // input type
    equals?: NexusGenEnums['Network'] | null; // Network
    in?: Array<NexusGenEnums['Network'] | null> | null; // [Network]
    not?: NexusGenInputs['NetworkFilter'] | null; // NetworkFilter
    notIn?: Array<NexusGenEnums['Network'] | null> | null; // [Network]
  }
  PaymentNetworkHashCompoundUniqueInput: { // input type
    hash: string; // String!
    network: NexusGenEnums['Network']; // Network!
  }
  PaymentWhereUniqueInput: { // input type
    network_hash?: NexusGenInputs['PaymentNetworkHashCompoundUniqueInput'] | null; // PaymentNetworkHashCompoundUniqueInput
  }
  StringFilter: { // input type
    contains?: string | null; // String
    endsWith?: string | null; // String
    equals?: string | null; // String
    gt?: string | null; // String
    gte?: string | null; // String
    in?: Array<string | null> | null; // [String]
    lt?: string | null; // String
    lte?: string | null; // String
    mode?: NexusGenEnums['StringFilterMode'] | null; // StringFilterMode
    not?: NexusGenInputs['StringFilter'] | null; // StringFilter
    notIn?: Array<string | null> | null; // [String]
    startsWith?: string | null; // String
  }
}

export interface NexusGenEnums {
  Network: "BSC" | "BSCT" | "ETHEREUM" | "GOERLI"
  PaymentStatus: "COMPLETED" | "FAILED" | "PENDING"
  StringFilterMode: "default" | "insensitive"
}

export interface NexusGenScalars {
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
  DateTime: Date
  Decimal: Decimal
}

export interface NexusGenObjects {
  Deposit: { // root type
    addressContract: string; // String!
    addressFrom: string; // String!
    addressTo: string; // String!
    at: NexusGenScalars['DateTime']; // DateTime!
    blockNumber: NexusGenScalars['Decimal']; // Decimal!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    gas: NexusGenScalars['Decimal']; // Decimal!
    gasPrice: NexusGenScalars['Decimal']; // Decimal!
    hash: string; // String!
    network: NexusGenEnums['Network']; // Network!
    tokenDecimals: number; // Int!
    transactionIndex: number; // Int!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    value: NexusGenScalars['Decimal']; // Decimal!
  }
  DepositsConnection: { // root type
    edges: NexusGenRootTypes['DepositsConnectionEdges'][]; // [DepositsConnectionEdges!]!
    pageInfo: NexusGenRootTypes['ForwardPaginationPageInfo']; // ForwardPaginationPageInfo!
    totalCount: number; // Int!
  }
  DepositsConnectionEdges: { // root type
    cursor: string; // String!
    node: NexusGenRootTypes['Deposit']; // Deposit!
  }
  ForwardPaginationPageInfo: { // root type
    endCursor: string; // String!
    hasNextPage: boolean; // Boolean!
    hasPreviousPage: boolean; // Boolean!
    startCursor: string; // String!
  }
  Payment: { // root type
    addressContract?: string | null; // String
    addressFrom?: string | null; // String
    addressTo?: string | null; // String
    at?: NexusGenScalars['DateTime'] | null; // DateTime
    blockNumber?: NexusGenScalars['Decimal'] | null; // Decimal
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    gas?: NexusGenScalars['Decimal'] | null; // Decimal
    gasPrice?: NexusGenScalars['Decimal'] | null; // Decimal
    hash: string; // String!
    network: NexusGenEnums['Network']; // Network!
    status: NexusGenEnums['PaymentStatus']; // PaymentStatus!
    tokenDecimals?: number | null; // Int
    transactionIndex?: number | null; // Int
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    value?: NexusGenScalars['Decimal'] | null; // Decimal
  }
  Query: {};
}

export interface NexusGenInterfaces {
}

export interface NexusGenUnions {
}

export type NexusGenRootTypes = NexusGenObjects

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars & NexusGenEnums

export interface NexusGenFieldTypes {
  Deposit: { // field return type
    addressContract: string; // String!
    addressFrom: string; // String!
    addressTo: string; // String!
    at: NexusGenScalars['DateTime']; // DateTime!
    blockNumber: NexusGenScalars['Decimal']; // Decimal!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    gas: NexusGenScalars['Decimal']; // Decimal!
    gasPrice: NexusGenScalars['Decimal']; // Decimal!
    hash: string; // String!
    id: string; // ID!
    network: NexusGenEnums['Network']; // Network!
    payments: NexusGenRootTypes['Payment'][]; // [Payment!]!
    tokenDecimals: number; // Int!
    transactionIndex: number; // Int!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    value: NexusGenScalars['Decimal']; // Decimal!
  }
  DepositsConnection: { // field return type
    edges: NexusGenRootTypes['DepositsConnectionEdges'][]; // [DepositsConnectionEdges!]!
    pageInfo: NexusGenRootTypes['ForwardPaginationPageInfo']; // ForwardPaginationPageInfo!
    totalCount: number; // Int!
  }
  DepositsConnectionEdges: { // field return type
    cursor: string; // String!
    node: NexusGenRootTypes['Deposit']; // Deposit!
  }
  ForwardPaginationPageInfo: { // field return type
    endCursor: string; // String!
    hasNextPage: boolean; // Boolean!
    hasPreviousPage: boolean; // Boolean!
    startCursor: string; // String!
  }
  Payment: { // field return type
    addressContract: string | null; // String
    addressFrom: string | null; // String
    addressTo: string | null; // String
    at: NexusGenScalars['DateTime'] | null; // DateTime
    blockNumber: NexusGenScalars['Decimal'] | null; // Decimal
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    deposit: NexusGenRootTypes['Deposit']; // Deposit!
    gas: NexusGenScalars['Decimal'] | null; // Decimal
    gasPrice: NexusGenScalars['Decimal'] | null; // Decimal
    hash: string; // String!
    id: string; // ID!
    network: NexusGenEnums['Network']; // Network!
    status: NexusGenEnums['PaymentStatus']; // PaymentStatus!
    tokenDecimals: number | null; // Int
    transactionIndex: number | null; // Int
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
    value: NexusGenScalars['Decimal'] | null; // Decimal
  }
  Query: { // field return type
    bridgeBalance: NexusGenScalars['Decimal']; // Decimal!
    deposits: NexusGenRootTypes['DepositsConnection']; // DepositsConnection!
    sanityCheck: boolean; // Boolean!
    tokenCirculatingSupply: NexusGenScalars['Decimal']; // Decimal!
    tokenMaxSupply: NexusGenScalars['Decimal']; // Decimal!
  }
}

export interface NexusGenFieldTypeNames {
  Deposit: { // field return type name
    addressContract: 'String'
    addressFrom: 'String'
    addressTo: 'String'
    at: 'DateTime'
    blockNumber: 'Decimal'
    createdAt: 'DateTime'
    gas: 'Decimal'
    gasPrice: 'Decimal'
    hash: 'String'
    id: 'ID'
    network: 'Network'
    payments: 'Payment'
    tokenDecimals: 'Int'
    transactionIndex: 'Int'
    updatedAt: 'DateTime'
    value: 'Decimal'
  }
  DepositsConnection: { // field return type name
    edges: 'DepositsConnectionEdges'
    pageInfo: 'ForwardPaginationPageInfo'
    totalCount: 'Int'
  }
  DepositsConnectionEdges: { // field return type name
    cursor: 'String'
    node: 'Deposit'
  }
  ForwardPaginationPageInfo: { // field return type name
    endCursor: 'String'
    hasNextPage: 'Boolean'
    hasPreviousPage: 'Boolean'
    startCursor: 'String'
  }
  Payment: { // field return type name
    addressContract: 'String'
    addressFrom: 'String'
    addressTo: 'String'
    at: 'DateTime'
    blockNumber: 'Decimal'
    createdAt: 'DateTime'
    deposit: 'Deposit'
    gas: 'Decimal'
    gasPrice: 'Decimal'
    hash: 'String'
    id: 'ID'
    network: 'Network'
    status: 'PaymentStatus'
    tokenDecimals: 'Int'
    transactionIndex: 'Int'
    updatedAt: 'DateTime'
    value: 'Decimal'
  }
  Query: { // field return type name
    bridgeBalance: 'Decimal'
    deposits: 'DepositsConnection'
    sanityCheck: 'Boolean'
    tokenCirculatingSupply: 'Decimal'
    tokenMaxSupply: 'Decimal'
  }
}

export interface NexusGenArgTypes {
  Deposit: {
    payments: { // args
      after?: NexusGenInputs['PaymentWhereUniqueInput'] | null; // PaymentWhereUniqueInput
      before?: NexusGenInputs['PaymentWhereUniqueInput'] | null; // PaymentWhereUniqueInput
      first?: number | null; // Int
      last?: number | null; // Int
    }
  }
  Query: {
    bridgeBalance: { // args
      network: NexusGenEnums['Network']; // Network!
    }
    deposits: { // args
      after?: string | null; // String
      before?: string | null; // String
      first?: number | null; // Int
      last?: number | null; // Int
      where?: NexusGenInputs['DepositWhereInput'] | null; // DepositWhereInput
    }
    sanityCheck: { // args
      network: NexusGenEnums['Network']; // Network!
    }
    tokenCirculatingSupply: { // args
      network: NexusGenEnums['Network']; // Network!
    }
    tokenMaxSupply: { // args
      network: NexusGenEnums['Network']; // Network!
    }
  }
}

export interface NexusGenAbstractTypeMembers {
}

export interface NexusGenTypeInterfaces {
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = keyof NexusGenInputs;

export type NexusGenEnumNames = keyof NexusGenEnums;

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = keyof NexusGenScalars;

export type NexusGenUnionNames = never;

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never;

export type NexusGenAbstractsUsingStrategyResolveType = never;

export type NexusGenFeaturesConfig = {
  abstractTypeStrategies: {
    isTypeOf: false
    resolveType: true
    __typename: false
  }
}

export interface NexusGenTypes {
  context: MyContextType;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  inputTypeShapes: NexusGenInputs & NexusGenEnums & NexusGenScalars;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  fieldTypeNames: NexusGenFieldTypeNames;
  allTypes: NexusGenAllTypes;
  typeInterfaces: NexusGenTypeInterfaces;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractTypeMembers: NexusGenAbstractTypeMembers;
  objectsUsingAbstractStrategyIsTypeOf: NexusGenObjectsUsingAbstractStrategyIsTypeOf;
  abstractsUsingStrategyResolveType: NexusGenAbstractsUsingStrategyResolveType;
  features: NexusGenFeaturesConfig;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
  interface NexusGenPluginArgConfig {
  }
}