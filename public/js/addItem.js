document.addEventListener('DOMContentLoaded', () => {
    const addItemForm = document.getElementById('addItemForm');

    addItemForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        let id;
        try {
            const response = await fetch('/user/currentUserId');
            const data = await response.json();
            id = data.userId;
        } catch (error) {
            alert('Failed to get user ID, please make sure you are logged in.');
            return;
        }

        const formData = new FormData(addItemForm);

        const itemData = {
            ownerId: id,
            itemName: formData.get('itemName'),
            itemDesc: formData.get('itemDesc'),
            itemTags: formData.get('itemTags').split(',').map(tag => tag.trim()),
            itemPrice: parseFloat(formData.get('itemPrice')),
            itemImg: formData.get('itemImg'),
            itemStatus: formData.get('itemStatus') === 'true'
        };
        console.log("itemStatus1:" + itemData.itemStatus);
        // console.log("itemStatus2:" + itemData.itemStatus);
        try {
            const response = await fetch('/item/addItem', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(itemData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error);
            }

            alert('Item added successfully');
            addItemForm.reset();
        } catch (error) {
            alert(`Item added failed:${error.message}`);
        }
    });
});
