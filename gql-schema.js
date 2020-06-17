const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLBoolean,
} = require("graphql");

const graphqlIsoDate = require("graphql-iso-date");
const { GraphQLDateTime, GraphQLDate } = graphqlIsoDate;

/* models */
const User = require("./models/user");
const Service = require("./models/service");
const Reservation = require("./models/reservation");

/* login */
const bcrypt = require("bcrypt");
const auth = require("./jwt-auth");

/*

  GQL Object Type
  
*/
const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    username: { type: GraphQLString },
    mobileNo: { type: GraphQLString },
    role: { type: GraphQLString },
    token: { type: GraphQLString },
    createdAt: { type: GraphQLDateTime },
    updatedAt: { type: GraphQLDateTime },
    // reservations: {
    //   type: new GraphQLList(ReservationType),
    //   resolve: (parent, args) => {
    //     return Reservation.find({ userId: parent.id });
    //   },
    // },
  }),
});

const ServiceType = new GraphQLObjectType({
  name: "Service",
  fields: () => ({
    id: { type: GraphQLID },
    service: { type: GraphQLString },
    description: { type: GraphQLString },
    price: { type: GraphQLInt },
    image: { type: GraphQLString },
    createdAt: { type: GraphQLDateTime },
    updatedAt: { type: GraphQLDateTime },
  }),
});

const ReservationType = new GraphQLObjectType({
  name: "Reservation",
  fields: () => ({
    id: { type: GraphQLID },
    referenceNo: { type: GraphQLString },
    reservationDate: { type: GraphQLString },
    reservationTime: { type: GraphQLString },
    totalPrice: { type: GraphQLInt },
    userId: { type: GraphQLID },
    serviceId: { type: GraphQLID },
    createdAt: { type: GraphQLDateTime },
    updatedAt: { type: GraphQLDateTime },
    // users: {
    //   type: new GraphQLList(UserType),
    //   resolve: (parent, args) => {
    //     return User.find({ _id: parent.userId });
    //   },
    // },
    user: {
      type: UserType,
      resolve: (parent, args) => {
        return User.findById(parent.userId);
      },
    },
    service: {
      type: ServiceType,
      resolve: (parent, args) => {
        return Service.findById(parent.serviceId);
      },
    },
  }),
});

/* 

  GQL Root Query 
  
*/
const RootQuery = new GraphQLObjectType({
  name: "Query",
  fields: {
    /* to retrieve all users */
    users: {
      type: new GraphQLList(UserType),
      resolve: (parents, args) => {
        return User.find({});
      },
    },

    /* to retrieve a single user */
    user: {
      type: UserType,
      args: {
        id: { type: GraphQLID },
      },
      resolve: (parent, args) => {
        return User.findById(args.id);
      },
    },

    reservations: {
      type: new GraphQLList(ReservationType),
      resolve: (parents, args) => {
        return Reservation.find({});
      },
    },

    reservation: {
      type: ReservationType,
      args: {
        id: { type: GraphQLID },
      },
      resolve: (parents, args) => {
        return Reservation.findById(args.id);
      },
    },

    services: {
      type: new GraphQLList(ServiceType),
      resolve: (parents, args) => {
        return Service.find({});
      },
    },

    service: {
      type: ServiceType,
      args: {
        id: { type: GraphQLID },
      },
      resolve: (parents, args) => {
        return Service.findById(args.id);
      },
    },
  },
});

/* 

Mutation

*/
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    /* 
          User Mutation
      */
    addUser: {
      type: UserType,
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        lastName: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        mobileNo: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => {
        let newUser = new User({
          firstName: args.firstName,
          lastName: args.lastName,
          email: args.email,
          username: args.username,
          password: bcrypt.hashSync(args.password, 10),
          mobileNo: args.mobileNo,
          role: "0", // 0 = normal user, 1 = admin
        });
        return newUser.save();
      },
    },
    updateUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        lastName: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        mobileNo: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => {
        let userId = { _id: args.id };
        let updates = {
          firstName: args.firstName,
          lastName: args.lastName,
          email: args.email,
          username: args.username,
          password: args.password,
          mobileNo: args.mobileNo,
        };
        return User.findOneAndUpdate(userId, updates, (user) => user);
      },
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: (parent, args) => {
        let userId = { _id: args.id };
        return User.findOneAndDelete(userId);
      },
    },

    addReservation: {
      type: ReservationType,
      args: {
        referenceNo: { type: new GraphQLNonNull(GraphQLString) },
        reservationDate: { type: new GraphQLNonNull(GraphQLString) },
        reservationTime: { type: new GraphQLNonNull(GraphQLString) },
        totalPrice: { type: new GraphQLNonNull(GraphQLInt) },
        userId: { type: new GraphQLNonNull(GraphQLID) },
        serviceId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: (parent, args) => {
        let newReservation = new Reservation({
          referenceNo: args.referenceNo,
          reservationDate: args.reservationDate,
          reservationTime: args.reservationTime,
          totalPrice: args.totalPrice,
          userId: args.userId,
          serviceId: args.serviceId,
        });
        return newReservation.save();
      },
    },

    updateReservation: {
      type: ReservationType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        referenceNo: { type: new GraphQLNonNull(GraphQLString) },
        reservationDate: { type: new GraphQLNonNull(GraphQLString) },
        reservationTime: { type: new GraphQLNonNull(GraphQLString) },
        totalPrice: { type: new GraphQLNonNull(GraphQLInt) },
        userId: { type: new GraphQLNonNull(GraphQLID) },
        serviceId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: (parent, args) => {
        let reservationId = { _id: args.id };
        let updates = {
          referenceNo: args.referenceNo,
          reservationDate: args.reservationDate,
          reservationTime: args.reservationTime,
          totalPrice: args.totalPrice,
          userId: args.userId,
          serviceId: args.serviceId,
        };
        return Reservation.findOneAndUpdate(
          reservationId,
          updates,
          (reservation) => reservation
        );
      },
    },

    deleteReservation: {
      type: ReservationType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: (parent, args) => {
        let reservationId = { _id: args.id };
        return Reservation.findOneAndDelete(reservationId);
      },
    },

    addService: {
      type: ServiceType,
      args: {
        service: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        price: { type: new GraphQLNonNull(GraphQLInt) },
        image: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => {
        let newService = new Service({
          service: args.service,
          description: args.description,
          price: args.price,
          image: args.image,
        });
        return newService.save();
      },
    },

    updateService: {
      type: ServiceType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        service: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        price: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        let serviceId = { _id: args.id };
        let updates = {
          service: args.service,
          description: args.description,
          price: args.price,
        };
        return Service.findOneAndUpdate(
          serviceId,
          updates,
          (service) => service
        );
      },
    },

    deleteService: {
      type: ServiceType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: (parent, args) => {
        let serviceId = { _id: args.id };
        return Service.findOneAndDelete(serviceId);
      },
    },

    login: {
      type: UserType,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => {
        let query = User.findOne({ email: args.email });

        return query
          .then((user) => user)
          .then((user) => {
            if (user == null) {
              return null;
            }

            let isPasswordMatched = bcrypt.compareSync(
              args.password,
              user.password
            );

            if (isPasswordMatched) {
              user.token = auth.createToken(user.toObject());
              return user;
            } else {
              return null;
            }
          });
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
