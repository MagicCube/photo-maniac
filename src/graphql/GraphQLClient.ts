export class GraphQLClient {
  constructor(readonly gatewayURL: string) {}

  query<V, R = unknown>(
    operationName: string,
    query: string,
    variables: V
  ): Promise<R> {
    return fetch(this.gatewayURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': 'fetch',
        'X-500PX-TOKEN': 'fetch',
      },
      body: JSON.stringify({
        operationName,
        variables,
        query,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.errors) {
          throw new Error(json.errors[0].message);
        } else {
          return json.data as R;
        }
      });
  }
}
