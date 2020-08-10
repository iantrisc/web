// eslint-disable-next-line import/extensions
import 'regenerator-runtime/runtime.js';

import { useState, useEffect } from 'react';

import API from '../constants/Api';

/**
 * Hook for fetch requests.
 *
 * @param {string} route The route for the API endpoint.
 * @param {object} object {
 *                    method. The fetch method.
 *                    body. The fetch body.
 *                    defaultValue. The request response default value.
 *                 }
 */
export function useFetch(
  route,
  { method = 'POST', body, defaultValue = false }
) {
  const [data, setData] = useState(defaultValue);

  useEffect(() => {
    let isCancelled = false;

    const fetchData = async () => {
      try {
        const response = await fetch(`${API}/${route}`, {
          method,
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(body),
        });

        if (!isCancelled) {
          if (response.ok && response.status === 200) {
            const json = await response.json();

            setData(json);
          } else {
            setData({ err: { status: response.status } });
          }
        }
      } catch (err) {
        if (!isCancelled) {
          setData({ err });
        }
      }
    };

    if (data === defaultValue) fetchData();

    return () => {
      isCancelled = true; // stop the setData is the component is remove.
    };
  }, [route, method, body, defaultValue, data]);

  return data;
}

/**
 * Hook for the GraphQL requests.
 *
 * @param {string} route The route for the API endpoint.
 * @param {object} object {
 *                    type. The GraphQL query type.
 *                    params. The GraphQL query parameters.
 *                    body. The GraphQL body.
 *                    defaultValue. The query response default value.
 *                 }
 */
export function useGraphQL(
  route,
  { type, body, params = '', defaultValue = false }
) {
  const [data, setData] = useState(defaultValue);

  useEffect(() => {
    let isCancelled = false;

    const fetchData = async () => {
      try {
        let query = '';

        if (params !== '') query = `{ ${type}(${params}) { ${body} } }`;
        else query = `{ ${type} { ${body} } }`;

        const response = await fetch(`${API}/${route}`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ query }),
        });

        if (!isCancelled) {
          if (response.ok && response.status === 200) {
            const json = await response.json();

            if ('error' in json.data) {
              setData({ err: json.data.error });
            } else {
              setData(json.data[type]);
            }
          } else {
            setData({ err: { status: response.status } });
          }
        }
      } catch (err) {
        if (!isCancelled) {
          setData({ err });
        }
      }
    };

    if (data === defaultValue) fetchData();

    return () => {
      isCancelled = true; // stop the setData is the component is remove.
    };
  }, [route, type, params, body, defaultValue, data]);

  return data;
}
