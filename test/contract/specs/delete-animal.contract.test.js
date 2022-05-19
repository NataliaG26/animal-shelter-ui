import { provider } from '../config/init-pact';
import { Matchers } from '@pact-foundation/pact';
import { AnimalController } from '../../../controllers';
import { eachLike } from '@pact-foundation/pact/src/dsl/matchers';

describe('Animal Service', () => {
    describe('When a request to list all animals is made', () => {

        beforeAll(async () => {
            await provider.setup();
            await provider.addInteraction({
                uponReceiving: 'a request to delete an animal',
                state: "has the animal to delete",
                withRequest: {
                    method: 'DELETE',
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
            });
        });

        test('should return the correct data', async () => {
            const response = await AnimalController.delete("manchas");
            
            expect(response.data).toMatchSnapshot();
            await provider.verify()

        });

        afterAll(() => provider.finalize());
    });
});