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

const category = [
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
    })
});

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        products: {
            type: new GraphQLList(ProductType),
            description: 'List of Product',
            resolve: () => products
        }
    })
})

const schema = new GraphQLSchema({
    query: RootQueryType
})

app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true
}))

app.listen(5000, () => console.log('Server is Running fast'))