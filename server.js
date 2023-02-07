const express = require('express');
const expressGraphQL = require('express-graphql').graphqlHTTP;
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull

} = require('graphql')
const app = express();

const categories = [
    { id: 1, name: 'Mobile Phones' },
    { id: 2, name: 'Tablets' },
    { id: 3, name: 'Laptops' },
]

const products = [
    { id: 1, name: 'iPhone 11 pro', categoryId: 1 },
    { id: 2, name: 'iPhone 10 mini', categoryId: 1 },
    { id: 3, name: 'iPhone 9 max', categoryId: 1 },
    { id: 4, name: 'Acer Alu 2', categoryId: 3 },
    { id: 5, name: 'Dell XP 1', categoryId: 3 },
    { id: 6, name: 'Lenovo Idea Pad', categoryId: 2 },
    { id: 7, name: 'iPad pro', categoryId: 2 },
]


const ProductType = new GraphQLObjectType({
    name: 'Product',
    description: 'This is the product details',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        categoryId: { type: GraphQLNonNull(GraphQLInt) },
        category: {
            type: CategoryType,
            resolve: (product) => {
                return categories.find(category => category.id === product.categoryId)
            }
        }
    })
});

const CategoryType = new GraphQLObjectType({
    name: 'Category',
    description: 'This is the category details',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        products: {
            type: new GraphQLList(ProductType),
            resolve: (category) => {
                return products.filter(product => product.categoryId === category.id)
            }
        }
    })
});

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        product: {
            type: ProductType,
            description: 'One Product',
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => products.find(product => product.id === args.id)
        },
        products: {
            type: new GraphQLList(ProductType),
            description: 'List of Product',
            resolve: () => products
        },
        categories: {
            type: new GraphQLList(CategoryType),
            description: 'List of Categories',
            resolve: () => categories
        },
        category: {
            type: CategoryType,
            description: 'One Category',
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => categories.find(category => category.id === args.id)
        },
    })
});

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        addProduct: {
            type: ProductType,
            description: 'Add a Product',
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                categoryId: { type: GraphQLNonNull(GraphQLInt) }
            },
            resolve: (parent, args) => {
                const product = { id: products.length + 1, name: args.name, categoryId: args.categoryId }
                products.push(product)
                return product
            }
        },
        addCategory: {
            type: CategoryType,
            description: 'Add a Category',
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve: (parent, args) => {
                const category = { id: categories.length + 1, name: args.name }
                products.push(category)
                return category
            }
        }
    })
})

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})

app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true
}))

app.listen(5000, () => console.log('Server is Running fast'))