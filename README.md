Thinkful-Annie-Node-Capstone

Track-Life:

#Models
Tracker:
   ◦ _id: ObjectId
   ◦ name: string
   ◦ description: string
   ◦ status: number // 1 = active, 2 = archived, 3 = deleted
   ◦ createdDate: Date
   ◦ notes: string
   ◦ tallyMarks: object
      ◦ { 'YYYY-MM': number }

User:
   ◦ _id: ObjectId
   ◦ firstName: string
   ◦ imgUrl: string
   ◦ lastName: string
   ◦ userName: string
   ◦ password: string
   ◦ trackerIds: ObjectId[]





{
   name: 'Eat more tofu',
   description: 'it's good for you, I think',
   createdDate: '2017-10-22 20:38:43',
   notes: 'tofu steak recipe http://www.justmoretofu.com/steak',
   tallyMarks: {
               "2017-08": 10,
               "2017-09": 5,
               "2017-10": 11,
            }
}