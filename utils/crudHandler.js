const APIFeatures = require("./apiFeatures");
const AppError = require("./appError");
const catchAsyncHandler = require('./catchAsyncHandler');

exports.getAll = Model => catchAsyncHandler(async (req, res, next) => {
    const features = new APIFeatures(Model.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate()
        .populate()

    try {
        const totalDocuments = await Model.countDocuments(features.queryObj);
        const meta = {
            ...features.metaData(),
            total_no_of_documents: totalDocuments,
            last_page: Math.ceil(totalDocuments / features.metaData().docs_per_page)
        };

        const docs = await features.query;

        res.status(200).json({
            status: 'success',
            results: docs.length,
            data: {
                documents: docs,
                meta,
            },
        });
    } catch (err) {
        console.log(err)
        next(new AppError('Error fetching data', 500));
    }
});


exports.getOne = Model => catchAsyncHandler(async (req, res, next) => {
    console.log(req.params)

    const doc = await Model.findById(req.params.id).select('-updatedAt').populate(req.query.populate);

    if (!doc) return next(new AppError(`No document found with that ID,`, 404))

    res.status(200).json({
        status: 'success',
        data: {
            document: doc
        }
    })
})

exports.createNew = Model => catchAsyncHandler(async (req, res, next) => {
    const newDoc = await Model.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            document: newDoc
        }
    })
})

exports.updateOne = Model => catchAsyncHandler(async (req, res, next) => {
    const updatedDoc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    }).select('-updatedAt')

    if (!updatedDoc) return next(new AppError(`No document found with that ID,`, 404))

    res.status(200).json({
        status: 'success',
        data: {
            document: updatedDoc
        }
    });
});

exports.deleteOne = Model => catchAsyncHandler(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id)

    if (!doc) return next(new AppError(`No document found with that ID,`, 404))

    res.status(204).json({
        status: 'success',
        message: 'Successfully deleted document'
    })
})
