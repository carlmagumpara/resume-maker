// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { API_URL } from 'src/helpers/config';

// Define a service using a base URL and expected endpoints
export const landingApi = createApi({
  reducerPath: 'landingApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = getState()?.token?.value || '';

      // If we have a token set in state, let's assume that we should be passing it.
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      headers.set('Accept', 'application/json');

      return headers;
    },
  }),
  tagTypes: ['Landing'],
  endpoints: (builder) => ({
    getLanding: builder.query({
      query: ({ search = '', business_category_id = '', page = 1, per_page = 10, order_by = 'DESC' }) => `/landing?search=${search}&business_category_id=${business_category_id}&page=${page}&per_page=${per_page}&order_by=${order_by}`,
      providesTags: ['Landing'],
    }),
  }),
})

// Export hooks for usage in functional pages, which are
// auto-generated based on the defined endpoints
export const { 
  useGetLandingQuery,
} = landingApi