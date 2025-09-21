"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePackage = exports.deletePackage = exports.getById = exports.getAll = exports.create = void 0;
const async_handler_utils_1 = require("../utils/async-handler.utils");
const tour_package_model_1 = __importDefault(require("../models/tour_package.model"));
const error_handler_middleware_1 = __importDefault(require("../middlewares/error-handler.middleware"));
const cloudinary_utils_1 = require("../utils/cloudinary.utils");
const pagination_utils_1 = require("../utils/pagination.utils");
const tour_package_folder = '/tour_packages';
exports.create = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, destinations, start_date, end_date, seats_available, total_charge, total_seats, cost_type, description } = req.body;
    const { cover_image, images } = req.files;
    // console.log(images)
    if (!cover_image) {
        throw new error_handler_middleware_1.default('cover image is required', 400);
    }
    const tour_package = new tour_package_model_1.default({
        title,
        destinations: destinations ? JSON.parse(destinations) : null,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        seats_available: total_seats,
        total_seats,
        total_charge,
        cost_type,
        description,
    });
    if (!tour_package) {
        throw new error_handler_middleware_1.default('something went wrong. Try again later', 500);
    }
    tour_package.cover_image = yield (0, cloudinary_utils_1.uploadFile)(cover_image[0].path, tour_package_folder);
    if (images && images.length > 0) {
        const imagePath = yield Promise.all(images.map(img => (0, cloudinary_utils_1.uploadFile)(img.path, tour_package_folder)));
        tour_package.set('images', imagePath);
    }
    yield tour_package.save();
    res.status(201).json({
        message: 'package created successfully',
        success: true,
        status: 'success',
        data: tour_package
    });
}));
//get all
exports.getAll = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { query, start_date, end_date, min_price, max_price, seats_available, limit, page } = req.query;
    const page_limit = Number(limit) || 15;
    const current_page = Number(page) || 1;
    const skip = (current_page - 1) * page_limit;
    let filter = {};
    if (query) {
        filter.$or = [
            {
                title: {
                    $options: 'i',
                    $regex: query
                }
            },
            {
                description: {
                    $options: 'i',
                    $regex: query
                }
            },
        ];
    }
    if (start_date || end_date) {
        filter.start_date = {
            $gte: start_date
        };
    }
    if (end_date) {
        filter.start_date = {
            $lte: end_date
        };
    }
    if (min_price || max_price) {
        filter.total_charge = {
            $gte: min_price
        };
    }
    if (max_price) {
        filter.total_charge = {
            $lte: max_price
        };
    }
    if (seats_available) {
        filter.seats_available = {
            $gte: seats_available
        };
    }
    const tour_packages = yield tour_package_model_1.default.find(filter).limit(page_limit).skip(skip);
    const total = yield tour_package_model_1.default.countDocuments(filter);
    res.status(200).json({
        message: 'packages fetched successfully.',
        status: 'success',
        success: true,
        data: { data: tour_packages, pagination: (0, pagination_utils_1.getPagination)(total, page_limit, current_page) }
    });
}));
exports.getById = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { packageId } = req.params;
    const tour_package = yield tour_package_model_1.default.findById(packageId);
    if (!tour_package) {
        throw new error_handler_middleware_1.default("package not found", 404);
    }
    res.status(200).json({
        message: `package fetched`,
        status: "success",
        success: true,
        data: tour_package
    });
}));
exports.deletePackage = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { packageId } = req.params;
    const tour_package = yield tour_package_model_1.default.findById(packageId);
    if (!tour_package) {
        throw new error_handler_middleware_1.default('package not found', 404);
    }
    if (tour_package.cover_image) {
        yield (0, cloudinary_utils_1.deleteFile)([(_a = tour_package.cover_image) === null || _a === void 0 ? void 0 : _a.public_id]);
    }
    if (tour_package.images) {
        yield (0, cloudinary_utils_1.deleteFile)(tour_package.images.map(image => image === null || image === void 0 ? void 0 : image.public_id));
    }
    yield tour_package.deleteOne();
    res.status(200).json({
        message: `package deleted sucessfully`,
        success: true,
        status: 'success',
        data: tour_package
    });
}));
exports.updatePackage = (0, async_handler_utils_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { title, destinations, start_date, end_date, seats_available, total_charge, cost_type, description, deletedImage } = req.body;
    const { packageId } = req.params;
    const { cover_image, images } = req.files;
    const tour_package = yield tour_package_model_1.default.findById(packageId);
    if (!tour_package) {
        throw new error_handler_middleware_1.default('package not found', 404);
    }
    if (title)
        tour_package.title = title;
    if (destinations)
        tour_package.destinations = destinations;
    if (start_date)
        tour_package.start_date = start_date;
    if (end_date)
        tour_package.end_date = end_date;
    if (seats_available)
        tour_package.seats_available = seats_available;
    if (total_charge)
        tour_package.total_charge = total_charge;
    if (cost_type)
        tour_package.cost_type = cost_type;
    if (description)
        tour_package.cost_type = description;
    if (cover_image) {
        if (tour_package.cover_image) {
            yield (0, cloudinary_utils_1.deleteFile)([(_a = tour_package === null || tour_package === void 0 ? void 0 : tour_package.cover_image) === null || _a === void 0 ? void 0 : _a.public_id]);
        }
        tour_package.cover_image = yield (0, cloudinary_utils_1.uploadFile)(cover_image[0].path, tour_package_folder);
    }
    if (deletedImage && deletedImage.length > 0 && tour_package.images.length > 0) {
        yield (0, cloudinary_utils_1.deleteFile)(deletedImage);
        const oldImages = tour_package.images.filter((img) => !deletedImage.includes(img.public_id));
        //delete image from cloudinary
        tour_package.set('images', oldImages);
    }
    if (images && images.length > 0) {
        const imagePath = yield Promise.all(images.map(img => (0, cloudinary_utils_1.uploadFile)(img.path, tour_package_folder)));
        tour_package.set('images', [...tour_package.images, ...imagePath]);
    }
    yield tour_package.save();
    // OR findByIdAndUpdate (packageId,{title,
    //     destinations,
    //     start_date,
    //     end_date,
    //     seats_available,
    //     total_charge,
    //     cost_type,
    //     description},{new:true,reValidate:true})
    // if(destinations){
    //   tour_package.destinations = JSON.parse(destinations);
    //     await tour_package.save()
    // }
    res.status(200).json({
        message: `tour package updated successully`,
        success: true,
        status: 'success',
        data: tour_package
    });
}));
