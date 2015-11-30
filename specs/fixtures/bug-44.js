describe('async methods', () => {
      it('commits multiple valid inserts to the database', done => {
        const methodUnderTest = async (unitOfWork) => {
          const insert = { method: 'insert' };

          await new unitOfWork.Users(getUserWithEmail('1')).save(null, insert);
          await new unitOfWork.Users(getUserWithEmail('2')).save(null, insert);
          await new unitOfWork.Users(getUserWithEmail('3')).save(null, insert);
        };

        new SomeService(methodUnderTest)
          .runMethodUnderTest()
          .then(() => bookshelf.Users.count())
          .then(count => expect(count).to.equal('3'))
          .then(() => done(), done);
      })
    });