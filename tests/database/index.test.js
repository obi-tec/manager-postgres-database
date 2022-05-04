const { DatabaseConnection } = require('../../src');
  
describe('Check database connection', () => {
  it('Should throw an error if you try instanciate database', async () => {
    const action = async () => {
      new DatabaseConnection();
    };

    await expect(action).rejects.toThrow('Database connection cannot be instantiated');
  });
});
  