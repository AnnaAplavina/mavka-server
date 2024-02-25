import assert from 'assert';
import axios from 'axios';

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiaWF0IjoxNzA2MjkyNTg5LCJleHAiOjE3MDY4OTczODl9.Icqq7H6GWyf99rbmdAueqV8lsOf6VNVACU5qd2ZNktE';

describe('User management test', () => {
  describe('GET /users/{username}', () => {
    it('should get user data by username', async () => {
      const res = await axios.get('http://localhost:5000/users/gervant', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.username, 'gervant');
      assert.strictEqual(res.data.first_name, 'Герольд');
      assert.strictEqual(res.data.last_name, 'Ривский');
      assert.strictEqual(res.data.wall_id, 6);
      assert.strictEqual(
        res.data.avatar_url,
        'https://i.ibb.co/t33h8S6/witcher.jpg'
      );
    });

    it('should handle unauthorized access', async () => {
      try {
        await axios.get('http://localhost:5000/users/gervant');
        assert.fail('Unauthorized access should be handled');
      } catch (error) {
        assert.strictEqual(error.response.status, 401);
      }
    });
  });

  describe('GET /users/private/{username}', () => {
    it('should get user data by username', async () => {
      const res = await axios.get(
        'http://localhost:5000/users/private/gervant',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.username, 'gervant');
      assert.strictEqual(res.data.first_name, 'Герольд');
      assert.strictEqual(res.data.last_name, 'Ривский');
      assert.strictEqual(res.data.wall_id, 6);
      assert.strictEqual(res.data.email, 'ger@gmail.com');
      assert.strictEqual(
        res.data.avatar_url,
        'https://i.ibb.co/t33h8S6/witcher.jpg'
      );
    });

    it('should handle unauthorized access', async () => {
      try {
        await axios.get('http://localhost:5000/users/private/gervant');
        assert.fail('Unauthorized access should be handled');
      } catch (error) {
        assert.strictEqual(error.response.status, 401);
      }
    });

    it('should handle permission denied', async () => {
      try {
        await axios.get('http://localhost:5000/users/private/woogy', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        assert.fail('Unauthorized access should be handled');
      } catch (error) {
        assert.strictEqual(error.response.status, 403);
      }
    });
  });
});
