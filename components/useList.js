import { useQuery } from 'react-query';
import axios from 'axios';

const fetchPosts = async (site, api) => {
    const { data } = await axios.get(`${api}/getList?site=${site}`);
    return data;
};

const useList = (site, api) => useQuery('posts', () => fetchPosts(site, api), {cacheTime: 0});
export default useList;