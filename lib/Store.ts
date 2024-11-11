import { useState, useEffect } from 'react';
// import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

/**
 * @param {number} channelId the currently selected Channel
 */
export const useStore = (props) => {
  const [channels, setChannels] = useState([]);
  const [header, setHeader] = useState({});
  const [copasData, setCopas] = useState([]);
  const [newCopas, handleDataCopas] = useState(null)
  const [deletedCopas, handleDeletedCopas] = useState(null)


  // Load initial data and set up listeners
  useEffect(() => {
    // Get Channels
    fetchCopas(props.sort_id,setCopas);
    // Listen for new and deleted messages
    const messageListener = supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => handleNewMessage(payload.new)
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'messages' },
        (payload) => handleDeletedMessage(payload.old)
      )
      .subscribe();
    // Listen for changes to our users
    const userListener = supabase
      .channel('public:users')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'users' },
        (payload) => handleNewOrUpdatedUser(payload.new)
      )
      .subscribe();
    // Listen for new and deleted channels
    const copasListener = supabase
        .channel('public:copas')
        .on(
            'postgres_changes',
            { event: 'UPDATE', schema: 'public', table: 'copas' },
            (payload) => handleDataCopas(payload.new.datas)
        )
    .subscribe();
    // Cleanup on unmount


    

    return () => {
    //   supabase.removeChannel(supabase.channel(messageListener));
    //   supabase.removeChannel(supabase.channel(userListener));
    supabase.removeChannel(supabase.channel(copasListener));
    };
}, []);

    useEffect(() => {
        if (newCopas) {
            setCopas(newCopas)
            // setChannels(channels.concat(newCopas))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newCopas])
  // Update when the route changes
//   useEffect(() => {
//     if (props?.sort_id > 0) {
//         fetchCopas(props.sort_id, (copas_data) => {
//             // messages.forEach((x) => users.set(x.user_id, x.author));
//             setCopas(copas_data);
//         });
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [props.sort_id]);


  return {
    copasData,
  };
};

/**
 * Fetch all channels
 * @param {function} setState Optionally pass in a hook or callback to set the state
 */
export const fetchChannels = async (setState) => {
  try {
    let { data } = await supabase.from('channels').select('*');
    if (setState) setState(data);
    return data;
  } catch (error) {
    console.log('error', error);
  }
};

/**
 * Fetch a single user
 * @param {number} userId
 * @param {function} setState Optionally pass in a hook or callback to set the state
 */
export const fetchUser = async (userId, setState) => {
  try {
    let { data } = await supabase.from('users').select(`*`).eq('id', userId);
    let user = data[0];
    if (setState) setState(user);
    return user;
  } catch (error) {
    console.log('error', error);
  }
};

export const fetchCopas = async (sort_id, setCopas) => {
    try {
      let { data } = await supabase.from('copas').select(`*`).eq('sort_id', sort_id);
      if (setCopas) data[0].datas;
      return data[0];
    } catch (error) {
      console.log('error', error);
    }
  };

export const addCopas = async () => {
    try {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 1);
        const year = expiresAt.getFullYear();
        const month = String(expiresAt.getMonth() + 1).padStart(2, '0'); // adds leading zero if needed
        const day = String(expiresAt.getDate()).padStart(2, '0');         // adds leading zero if needed

        const formattedDate = `${year}${month}${day}`;

        let { data } = await supabase
            .from('copas')
            .insert([{ expires_at: expiresAt }])
            //   .insert([{ expires_at: expiresAt, data: datas, id_custom: id_custom }])
            .select();

        if (data && data.length > 0) {
            const insertedId = data[0].id;
            const temp = insertedId +""+expiresAt.getDate();

            const { dataCopas, error } = await supabase
              .from('copas')
              .select('date_id, count:count(*)')
              .group('date_id');

            console.log('dataCopas:', dataCopas);
            

            if (error) {
              console.error('Error:', error);
            } else {
              console.log('Counts by date_id:', data);
            }

            const sort_id = parseInt(temp, 10).toString(36);
            let { dataUpdate } = await supabase
            .from('copas')
            .update({ available_ids : temp, sort_id: sort_id, datas: [],date_id : formattedDate })
            .eq('id', insertedId);

            return sort_id;
        }
        return 0;
    } catch (error) {
        console.log('error', error);
    }
};

export const addDataCopas = async (insertedId,dataParam) => {
    try {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 1);
        

        let { dataUpdate } = await supabase
            .from('copas')
            .update({ datas : dataParam })
            .eq('sort_id', insertedId);
        return 0;
    } catch (error) {
        console.log('error', error);
    }
};
