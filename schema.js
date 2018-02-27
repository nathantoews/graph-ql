const fetch = require('node-fetch')
const util = require('util')
const parseXML = util.promisify(require('xml2js').parseString)
const {
	GraphQLObjectType,
	GraphQLSchema,
	GraphQLInt,
	GraphQLString,
	GraphQLList
} = require('graphql')


const ServiceList = new GraphQLObjectType({
	name: 'Service',
	description: '...',
	fields: () => ({
		service_request_id: {
			type: GraphQLString,
		},
		address: {
			type: GraphQLString
		}
	})
})

const Service = new GraphQLObjectType({
	name: 'service',
	description: '...',
	fields: () => ({
		service: {
			type: new GraphQLList(ServiceList),
			resolve: root => {
				const codes = root.service_requests.map(service => service.service_request_id)
				return Promise.all(codes.map(code => 
					fetch(`https://secure.toronto.ca/webwizard/ws/requests.json?service_request_id=${code}?start_date=2012-02-01T00:00:00Z&end_date=2012-02-07T00:00:00&jurisdiction_id=toronto.ca`)
						.then(response => {
							console.log(response)
						})
				))
			}
		}
	})
})

module.exports = new GraphQLSchema({
	query: new GraphQLObjectType({
		name: 'Query',
		description: '...',
		fields: () => ({
			city: {
				type: Service,
				args: {
					id: { type: GraphQLString },
				},
				resolve: (root, args) => fetch(
						`https://secure.toronto.ca/webwizard/ws/requests.json?jurisdiction_id=${args.id}`
					)
					.then(response => response.json())
			}
		})
	})
})









