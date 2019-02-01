const express = require('express');
const app = express();
const express_graphql = require('express-graphql');
const { buildSchema } = require('graphql');
const { courses } = require('./data.json');


// Building Schema
const schema = buildSchema(`
type Query {
    course(id: Int!): Course
    coursesByTopic(topic: String!): [Course]
}

type Mutation{
  updateTopic(id: Int!, topicId: Int!, topicNew: String!): Course
  addTopic(courseId: Int!, newTopicTitle: String!): Course
}

type Course {
    id: Int
    title: String
    description: String
    author: String
    topics: [Topic]
    url: String
}

type Topic{
  id: Int
  title: String
}

`)


// Queries Methods
const getCourse = (args) => {
  const id = args.id;
  return courses.filter(course => {
    return course.id === id
  })[0]
}

const getCoursesByTopic = ({ topic }) => {
  let coursesByTopic = [];
  courses.forEach(course => {
    course.topics.forEach(topicElement => {
      if (topicElement.title === topic) {
        coursesByTopic.push(course);
      }
    })
  })
  return coursesByTopic;
}

const updateCourseTopic = ({ id, topicId, topicNew }) => {
  courses.forEach(course => {
    if (course.id === id) {
      course.topics.forEach(topicElement => {
        if (topicElement.id === topicId) {
          topicElement.title = topicNew;
          return course;
        }
      })
    }
  })
  return courses.filter(course => course.id === id)[0];
}


const addCourseTopic = ({ courseId, newTopicTitle }) => {
  courses.map(course => {
    if (course.id === courseId) {
      course.topics.push({
        id: course.topics.length + 1,
        title: newTopicTitle
      });
      console.log(course.topics);
    }
  })
  return courses.filter(course => course.id === courseId)[0];
}

const root = {
  course: getCourse,
  coursesByTopic: getCoursesByTopic,
  updateTopic: updateCourseTopic,
  addTopic: addCourseTopic
}

app.use('/graphql', express_graphql({
  schema: schema,
  rootValue: root,
  graphiql: true
}))

app.listen(3000, () => console.log('Server Listening'));
