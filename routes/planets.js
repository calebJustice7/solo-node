const Router = require("express").Router();
const axios = require("axios");

async function _fetchPlanets(obj) {
    return new Promise(async (resolve, reject) => {
        let promises = [];

        // Could be changed to be more dynamic, but in this case i know there is 6 pages.
        for (let i = 1; i < 6; i++) {
            promises.push(axios.get(`https://swapi.dev/api/planets/?page=${i}`).then(res => res.data.results));
        }

        Promise.all(promises)
            .then(results => {
                obj.planets = results.flat();
                obj.planetsCount = obj.planets.length;
                resolve(obj);
            })
            .catch(err => {
                reject(err);
            })
    });
}

async function _joinResidents(planet) {
    return new Promise((resolve, reject) => {
        let promises = planet.residents.map(resident => axios.get(resident).then(res => res.data));

        Promise.all(promises)
            .then((results) => {
                planet.residents = results.map(resident => resident.name);
                resolve(planet);
            })
            .catch(e => {
                reject(e);
            })
    });
}

async function _joinAllResidents(obj) {
    return new Promise((resolve, reject) => {
        let promises = [];
        obj.planets.forEach(planet => {
            promises.push(_joinResidents(planet));
        });

        Promise.all(promises)
            .then(() => {
                resolve(obj);
            })
            .catch(err => {
                reject(err);
            })
    });
}

Router.get("/", (req, res) => {
    
    _fetchPlanets({})
        .then(obj => {
            return _joinAllResidents(obj);
        })
        .then(obj => {
            res.status(200).json(obj.planets);
        })
        .catch((e) => {
            res.status(500).send({error: e.message});
        })
});

module.exports = Router;