export default function CheckLocalStorage (item) {
    // const localUserId=

            //If there is no id stored in the local cache, store the newly created
            // if (!localUserId) localStorage.setItem("_id",response.data.id);
    return localStorage.getItem(item);
}