var utils = {

    checkBool: function (value) {
        return (value == true ? 1 : null)
    },

    executeQuery: function (query, database) {
        return new Promise(function (resolve, reject) {

            database.getConnection(function (err, connection) {
                connection.query(query, function (err, results) {
                    connection.release();
                    if (err) {
                        reject(err);
                    } else {
                        resolve(results);
                    }
                })
            })
        });
    },

    validateRequest: function (requestBody, requiredFieldsArray) {

        var validationResult = {
            isValid: true,
            message: ''
        }

        requiredFieldsArray.forEach(function (field) {
            if (!requestBody[field]) {
                validationResult.isValid = false;
                validationResult.message += `value for ${field} is missing `;
            }
        });

        return validationResult;


    },
    classJSON: [
        { created_at: new Date(), class_name: "IX" },
        { created_at: new Date(), class_name: "X" },
        { created_at: new Date(), class_name: "XI" },
        { created_at: new Date(), class_name: "XII" },
        { created_at: new Date(), class_name: "ICOM_I" },
        { created_at: new Date(), class_name: "ICOM_II" },        
        { created_at: new Date(), class_name: "Bcom_I" },
        { created_at: new Date(), class_name: "Bcom_II" }
    ],
    subjectsJSON: [
        { created_at: new Date(), subject_name: "Maths" },
        { created_at: new Date(), subject_name: "Physics" },
        { created_at: new Date(), subject_name: "Chemistry" },
        { created_at: new Date(), subject_name: "Biology" },
        { created_at: new Date(), subject_name: "Computer Science" }
    ]
}

module.exports = utils;