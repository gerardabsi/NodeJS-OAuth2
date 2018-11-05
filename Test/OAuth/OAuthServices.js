const chai = require("chai");
const expect = chai.expect;
const chaiAsPromise = require('chai-as-promised');
chai.use(chaiAsPromise);
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const rewire = require('rewire');

let mongoose = require('mongoose');
let OAuthServices = require('../../OAuth/OAuthServices')();
let User = require('../../OAuth/OAuthModels/User');
let OAuthClient = require('../../OAuth/OAuthModels/OAuthClient');

let sandbox = sinon.createSandbox();

describe("OAuthServices test", () => {
    let findOneSub;
    let deleteSub;
    let sampleArgs;
    let sampleUser;
    let sampleClient;

    beforeEach(() => {
        sampleUser = {
            _id: '5a2657e04c91ed6db578c6d3',
            username: 'johnsmith',
            password: 'password'
        };
        sampleClient = {
            _id: '5a2657e04c91ed6db578c6d4',
            client_id: 'johnsmith',
            client_secret: 'u0i1gJLB7O',
            User: '5a2657e04c91ed6db578c6d3'
        };
        findOneSub = sandbox.stub(mongoose.Model, 'findOne').resolves(sampleUser);
        deleteSub = sandbox.stub(mongoose.Model, 'remove').resolves(true);
    });

    afterEach(() => {
        sandbox.restore();
        OAuthServices = rewire('../../OAuth/OAuthServices')();
    });

    context('User', () => {
        it('Should get error when getting user without parameters', done => {
            OAuthServices.getUser(null, null).then(result => {
                throw new Error('Unexpected Success');
            }).catch(exception => {
                expect(exception).to.instanceOf(Error);
                expect(exception.message).to.equal('Invalid Parameters');
                done();
            });
        });

        it('Should Return A user', done => {
            sandbox.restore();
            let stub = sandbox.stub(mongoose.Model, 'findOne').yields(null, sampleUser);

            OAuthServices.getUser('johnsmith', 'password').then((result) => {
                expect(result).to.be.a('object');
                expect(result).to.have.property('_id').to.equal('5a2657e04c91ed6db578c6d3');
                expect(result).to.have.property('username').to.equal('johnsmith');
                expect(result).to.have.property('password').to.equal('password');
                stub.restore();
                done();
            })
        });

    });

    context('Client', () => {
        it('Should get error when getting client without parameters', done => {
            OAuthServices.getClient(null).then(result => {
                throw new Error('Unexpected Success');
            }).catch(exception => {
                expect(exception).to.instanceOf(Error);
                expect(exception.message).to.equal('Invalid Parameters');
                done();
            });
        });

        it('Should Return A OAuth Client', done => {
            sandbox.restore();
            let stub = sandbox.stub(mongoose.Model, 'findOne').yields(null, sampleClient);

            OAuthServices.getClient('5a2657e04c91ed6db578c6d3').then((result) => {
                expect(result).to.be.a('object');
                expect(result).to.have.property('_id').to.equal('5a2657e04c91ed6db578c6d4');
                expect(result).to.have.property('client_id').to.equal('johnsmith');
                expect(result).to.have.property('client_secret').to.equal('u0i1gJLB7O');
                expect(result).to.have.property('User').to.equal('5a2657e04c91ed6db578c6d3');
                stub.restore();
                done();
            })
        });
    });

    context('Create user', () => {
        let FakeUser, saveSub, result;

        beforeEach(() => {
            saveSub = sandbox.stub().resolves(sampleUser);
            FakeUser = sandbox.stub().return({
                save: saveSub
            });
        });

        it('should get error when creating user with invalid parameters', done => {
            OAuthServices.createUser().then(result => {
                throw new Error('Unexpected Success');
            }).catch(exception => {
                expect(exception).to.instanceOf(Error);
                expect(exception.message).to.equal('Invalid Parameters');
                done();
            })
        })
    });

    context('Delete Tokens', () => {
        it('should check for passed user', done => {
            OAuthServices.deleteUserTokens().then(result => {
                throw new Error('Unexpected Success');
            }).catch(exception => {
                expect(exception).to.instanceOf(Error);
                expect(exception.message).to.equal('Invalid Parameters');
                done();
            })
        });
        it('should call delete OAuth Tokens', done => {
            sandbox.restore();
            let stub = sandbox.stub(mongoose.Model, 'remove').yields(null, true);
            OAuthServices.deleteUserTokens('5a2657e04c91ed6db578c6d3').then(result => {
                expect(result).to.equal(true);
                stub.restore();
                done();
            })
        });
    });

});