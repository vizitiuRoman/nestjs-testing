## Description

An example of nestjs testing without using mocks

## Example of TDD for a new endpoint

**e.g - Get user by id**

Cases: 
- successfully return user
- should not find user

```typescript
describe('Get user by id', () => {
  it('should successfully return a user', async () => {
    userRepository.addUser(userEntity);

    const response = await app.inject({
      method: 'GET',
      url: '/users/1',
    });
    const userDto: UserDto = response.json();

    expect(response.statusCode).toBe(HttpStatus.OK);
    expect(userDto).toMatchObject(userEntity);
  });

  it('should not find a user', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/users/100',
    });

    expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(response.json().message).toEqual(`cannot find user by id: 100`);
  });
});
```
Run tests
```bash
yarn test
```

Result
```bash
  ● Test cases for user api › Get user by id › should successfully return user

    expect(received).toBe(expected) // Object.is equality

    Expected: 200
    Received: 404

  ● Test cases for user api › Get user by id › should not find user

    expect(received).toEqual(expected) // deep equality

    Expected: "cannot find user by id: 100"
    Received: "Cannot GET /users/100"

```

**Implement endpoint**

```typescript
  @Get(':id')
  public async getById(
    @Param('id', new ParseIntPipe()) id: number,
  ): Promise<UserDto> {
    const user = await this.userRepository.findOneById(id);
    if (user === null) {
      throw new NotFoundException(`cannot find user by id: ${id}`);
    }
  
    return UserDto.asEntity(user);
  }
```

Run tests
```bash
yarn test
```

Result
```bash
PASS  src/modules/user/__tests__/user.controler.spec.ts

Test Suites: 2 passed, 2 total
Tests:       11 passed, 11 total
```
