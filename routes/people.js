const Router = require("express").Router();
const axios = require("axios");

async function _fetchPeople(obj) {
    return new Promise(async (resolve, reject) => {
        let promises = [];
        let sortAttributes = ["name", "height", "mass"];
        if (obj.sortBy && !sortAttributes.includes(obj.sortBy)) {
            reject(new Error("Invalid sort attribute passed in"));
            return;
        }

        // Could be changed to be more dynamic, but in this case i know there is 9 pages.
        for (let i = 1; i < 10; i++) {
            promises.push(axios.get(`https://swapi.dev/api/people/?page=${i}`).then(res => res.data.results));
        }

        Promise.all(promises)
            .then(results => {
                obj.people = obj.sortBy 
                    ? results.flat().sort(((a, b) => {
                        // Checks if attribute is sortable as an int rather then string.
                        if (!isNaN(a[obj.sortBy])) {
                            return Number(a[obj.sortBy]) > Number(b[obj.sortBy]) ? 1 : -1;
                        } else {
                            return a[obj.sortBy] > b[obj.sortBy] ? 1 : -1;
                        }
                    })) 
                    : results.flat();
                obj.peopleCount = obj.people.length;
                resolve(obj);
            })
            .catch(err => {
                reject(err);
            })
    });
}

Router.get("/", (req, res) => {
    
    _fetchPeople({
        sortBy: req.query.sortBy
    })
        .then(obj => {
            res.status(200).json(obj.people);
        })
        .catch((e) => {
            res.status(500).send({error: e.message});
        })
});

module.exports = Router;