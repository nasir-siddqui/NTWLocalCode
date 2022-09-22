var deleteConfirmation = function () {
    var confirmationVisible = false;

    return {
        showConfirmation: function (event, controllerName, deleteAction, entityName, id, id2, id3, id4, id5) {
            if (confirmationVisible)
                return;

            var data = {
                controllerName: controllerName,
                deleteAction: deleteAction,
                entityName: entityName,
                id: id
            };

            if (id2 !== undefined) {
                data.id2 = id2;
            }

            if (id3 !== undefined) {
                data.id3 = id3;
            }

            if (id4 !== undefined) {
                data.id4 = id4;
            }

            if (id5 !== undefined) {
                data.id5 = id5;
            }

            confirmationVisible = true;
            var rowToDelete = $(event.target).closest('tr');
            $.get(
                '/Home/GetDeleteConfirm',
                data,
                function (deleteConfirmationView) {
                    $(deleteConfirmationView).insertAfter(rowToDelete);
                }
            );
        },
        hideConfirmation: function (event) {
            var deleteConfirmation = $(event.target).closest('tr');
            deleteConfirmation.remove();
            confirmationVisible = false;
        }
    };
}();