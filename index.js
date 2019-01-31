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
  updateCourseTopic(id: Int!, topic: String!): Course
  addCourseTopic(id: Int!, topic: String!): Course
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

const updateCourseTopic = ({ id, topicId, topic }) => {
  courses.map(course => {
    if (course.id === id) {
      course.topics.map(topicElement => {
        if (topicId === topicElement.id) {
          topicElement.title = topic;
          return course;
        }
      })
    }
  })
  return courses.filter(course => course.id === id)[0];
}


const addCourseTopic = ({ id, topicTitle, topicId }) => {
  const newTopic = {
    topicId,
    topicTitle
  }
  courses.map(course => {
    if (course.id === id) {
      course.topic.push(newTopic);
      return course;
    }
  })
  return courses.filter(course => course.id === id)[0];
}

const root = {
  course: getCourse,
  coursesByTopic: getCoursesByTopic,
  updateCourseTopic: updateCourseTopic,
  addCourseTopic: addCourseTopic
}

app.use('/graphql', express_graphql({
  schema: schema,
  rootValue: root,
  graphiql: true
}))

app.listen(3000, () => console.log('Server Listening'));
/*
query getCoursesByTopic($topic: String!) {
    coursesByTopic(topic: $topic) {
        title
        topics{
          id,
          title
        }
    }
}
// query var
{
  "topic": "Rust"
}
*/