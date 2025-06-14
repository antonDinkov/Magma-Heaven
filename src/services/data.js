const { Data } = require('../models/Data');

//TODO replace with real data service according to exam description

async function getAll() {
    return Data.find().lean();
};

async function getById(id) {
    return Data.findById(id).lean();
};

async function create(data, authorId) {
    const record = new Data({
        name: data.name,
        location: data.location,
        elevation: Number(data.elevation),
        year: Number(data.year),
        image: data.image,
        volcano: data.volcano,
        description: data.description,
        voteList: [],
        author: authorId
    });

    await record.save();

    return record;
};

async function update(id, userId, newData) {
    const record = await Data.findById(id);

    if (!record) {
        throw new Error("Record not found " + id);
    };

    if (record.author.toString() != userId) {
        throw new Error("Access denied");
    };

    //TODO replace with real properties
    record.name = newData.name;
    record.location = newData.location;
    record.elevation = newData.elevation;
    record.year = newData.year;
    record.image = newData.image;
    record.volcano = newData.volcano;
    record.description = newData.description;

    await record.save();

    return record;
};

async function vote(id, userId) {
    const record = await Data.findById(id);

    if (!record) {
        throw new Error("Record not found " + id);
    };

    //TODO replace with real properties
    record.voteList.push(userId);
    
    await record.save();

    return record;
}

async function deleteById(id, userId) {
    const record = await Data.findById(id);
    if (!record) {
        throw new Error("Record not found " + id);
    };

    if (record.author.toString() != userId) {
        throw new Error("Access denied");
    };

    await Data.findByIdAndDelete(id);
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    vote,
    deleteById
}