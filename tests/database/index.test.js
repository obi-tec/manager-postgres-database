/* eslint-disable jest/no-commented-out-tests */
// const { DatabaseConnection } = require('../../src');

// describe('Check database connection', () => {
//   it('Should throw an error bacause you must connect database before execute query', async () => {
//     const action = async () => {
//       await DatabaseConnection.getInstance().query('test', 'select * from user');
//     };

//     await expect(action).rejects.toThrow('You must initialize connection database before querying');
//   });

//   it('Should throw an error bacause you must connect database before execute queryFirstOrNull', async () => {
//     const action = async () => {
//       await DatabaseConnection.getInstance().queryFirstOrNull('test', 'select * from user');
//     };

//     await expect(action).rejects.toThrow('You must initialize connection database before querying');
//   });

//   it('Should throw an error bacause you didnt configure environments variables', async () => {
//     const action = async () => {
//       await DatabaseConnection.getInstance().connect();
//     };

//     await expect(action).rejects.toThrow('You must set the environment variables to use this package. See docs!');
//   });

//   // eslint-disable-next-line jest/no-commented-out-tests
//   // it('Should connect to database', async () => {
//   //   const action = async () => {
//   //     await DatabaseConnection.getInstance().connect({enableLogs: true});
//   //   };

//   //   await expect(action).toBeTruthy();
//   // });

//   it('Should throw an error if you try instanciate database', async () => {
//     const action = async () => {
//       new DatabaseConnection();
//     };

//     await expect(action).rejects.toThrow('Database connection cannot be instantiated');
//   });
// });
