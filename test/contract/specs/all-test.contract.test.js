import { provider } from '../config/init-pact';
import { Matchers } from '@pact-foundation/pact';
import { AnimalController } from '../../../controllers';

describe('Animal Service', () => {
    beforeAll(async () => {
        await provider.setup();
    });

    afterAll(() => provider.finalize());


    describe('#getLis', () => {
        it('When a request to list all animals is made', async function () {
            await provider.addInteraction({
                uponReceiving: 'a request to list all animals',
                state: "has animals",
                withRequest: {
                    method: 'GET',
                    path: '/animals'
                },
                willRespondWith: {
                    status: 200,
                    body: Matchers.eachLike(
                        {
                            name: Matchers.like('manchas'),
                            breed: Matchers.like("Bengali"),
                            gender: Matchers.like("Female"),
                            vaccinated: Matchers.boolean(true)
                        }
                    )
                }
            })

            const response = await AnimalController.list();

            expect(response.data).toMatchSnapshot();
            await provider.verify()


        })
    }),

        describe('#create', () => {
            it('When a request to add an animal', async function () {
                await provider.addInteraction({

                    uponReceiving: 'a request to add a new animal',
                    state: "hasn't animals",
                    withRequest: {
                        method: 'POST',
                        path: '/animals'
                    },
                    willRespondWith: {
                        status: 201,
                        body:
                        {
                            id: Matchers.like(10),
                            name: Matchers.like('manchas'),
                            breed: Matchers.like("Bengali"),
                            gender: Matchers.like("Female"),
                            vaccinated: Matchers.boolean(true),
                            vaccines: ["lupus", "rabia"]
                        }

                    }
                })

                //test
                const animal = {
                    //id: 10,
                    name: 'manchas',
                    breed: "Bengali",
                    gender: "Female",
                    vaccinated: true,
                    vaccines:["lupus", "rabia"]
                }
                const response = await AnimalController.register(animal);
                expect(response.data).toMatchSnapshot();
    
                await provider.verify()

            })
        }),

        describe('#delete', () => {
            it('When a request to delete an animal', async function () {
                await provider.addInteraction({
                    uponReceiving: 'a request to delete an animal',
                    state: "delete an animal",
                    withRequest: {
                        method: 'DELETE',
                        path: '/animals/manchas'
                    },
                    willRespondWith: {
                        status: 204
                        
                    }
                })
    
                const response = await AnimalController.delete("manchas");
                
                expect(response.data).toMatchSnapshot();
                await provider.verify()
    
            })
        }),

        describe('#getAnimal', () => {
            it('When a request to  get an animal', async function () {
                await provider.addInteraction({
                    uponReceiving: 'a request to get an animal',
                    state: "get an animal by name",
                    withRequest: {
                        method: 'GET',
                        path: '/animals/manchas'
                    },
                    willRespondWith: {
                        status: 200,
                        body: 
                            {
                                id: Matchers.like(10),
                                name: Matchers.like('manchas'),
                                breed: Matchers.like("Bengali"),
                                gender: Matchers.like("Female"),
                                vaccinated: Matchers.boolean(true),
                                vaccines:["lupus", "rabia"]
                            }
                        
                    }
                })
    
                const response = await AnimalController.getAnimal("manchas");
                
                expect(response.data).toMatchSnapshot();
                await provider.verify()
    
            })
        }),

        describe('#editAnimal', () => {
            it('When a request to edit an animal', async function () {
                await provider.addInteraction({
                    uponReceiving: 'a request to update an animal',
                    state: "update an animal",
                    withRequest: {
                        method: 'PUT',
                        path: '/animals/manchas'
                    },
                    willRespondWith: {
                        status: 200,
                        body: 
                            {
                                id: Matchers.like(10),
                                name: Matchers.like('manchas'),
                                breed: Matchers.like("Bengali"),
                                gender: Matchers.like("Female"),
                                vaccinated: Matchers.boolean(true),
                                vaccines:["lupus", "rabia"]
                            }
                        
                    }
                })

                const animal = {
                    id: 10,
                    name: 'manchas',
                    breed: "Bengali",
                    gender: "Female",
                    vaccinated: true,
                    vaccines:["lupus", "rabia"]
                }
    
                const response = await AnimalController.updateAnimal("manchas", animal);
                
                expect(response.data).toMatchSnapshot();
                await provider.verify()
    
            })
        })

})