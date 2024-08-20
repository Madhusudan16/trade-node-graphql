const { ApolloServer, gql } = require('apollo-server');
const db = require('./database');
// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
  
const typeDefs = gql`
  type RecordMain {
     recordId: Int
     ObjectID: String
     GlobalID: String
     Username: String
     Password: String
     passwordLU: String
     Name: String
     assessment: String
     surveyLocation: String
     permittee: String
     plu:Int
     LitterAssessment:Int
     location_name: String
     Surrounding_Land_Use: String
     Creek_Conditions: String
     Site_Survey: String
     Child_Volunteers_count:Int
     total_number_bags_filled:Int
     weight_of_trash:Int
     homeless_camps_encountered: String
     illegal_dumpsite: String
     notes_about_site: String
     Creation_date: String
     Creator: String
     Edit_date: String
     Editor: String
     x_value:Float
     y_value:Float
     city: String
     county: String
     material_group: String
  }
  type Query{
    recordmain(city: String, country: String, permit: String, plu:String, startDate: String, endDate: String, material_group: String): [RecordMain]
  }
  type cityCountry{
    city: String
    county: String
  }
  type Query{
    getCityCountry: [cityCountry]
  }
  type permittee{
    permittee: String
  }
  type Query{
    getPermittee: [permittee]
  }
  type plu{
    plu: String
  }
  type Query{
    getPlu: [plu]
  }
`;


// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.}
const resolvers = {
    Query: {
      recordmain:async (parent, args, context, info) => {
        let whereCondition = '';
        console.log('arg', args)
        if(args){
            if(args.city){
                whereCondition += ` and city = '${args.city}'`
            }
            if(args.country){
                whereCondition += ` and county = '${args.country}'`
            }
            if(args.permit){
              whereCondition += ` and permittee = '${args.permit}' `
            }
            if(args.plu){
              whereCondition += ` and plu = '${args.plu}' `
            }
            if(args.startDate && args.endDate){
              whereCondition += ` and STR_TO_DATE(Creation_date, '%m/%d/%Y') BETWEEN STR_TO_DATE('${args.startDate}', '%m/%d/%Y') AND STR_TO_DATE('${args.endDate}', '%m/%d/%Y') `
            }
        }
        try {
            const data = await db.query(`SELECT *, (select GROUP_CONCAT(DISTINCT record_trashitem.material_group SEPARATOR ', ') from record_trashitem where record_trashitem.recordid = record_main.RecordID  GROUP BY record_trashitem.recordid limit 1 ) as material_group  FROM record_main where 1=1 ${whereCondition}`);
            console.log(`SELECT * FROM record_main where 1=1 ${whereCondition}`);
            console.log(data);
            return data;

        } catch (error) {
            console.log(error)
        }
        // console.log(data);
      },
      getCityCountry:async (parent, args, context, info) => {
        try {
            const data = await db.query(`select DISTINCT city, county from record_main group by city, county`);
            return data;

        } catch (error) {
            console.log(error)
        }
        // console.log(data);
      },
      getPermittee:async (parent, args, context, info) => {
        try {
            const data = await db.query(`select permittee from record_main group by permittee`);
            return data;
        } catch (error) {
            console.log(error)
        }
        // console.log(data);
      },
      getPlu:async (parent, args, context, info) => {
        try {
        const data = await db.query(`select plu from record_main group by plu order by plu asc`);
        return data;
        } catch (error) {
            console.log(error)
        }
        // console.log(data);
      },

    }
  };
  const server = new ApolloServer({ typeDefs, resolvers });

  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
  
