/*globals*/

var Grid = require('gridfs');

module.exports = function (options) {
    return {
        getAll(req, res) {
            options.data.getAllCampaigns()
                .then(campaigns => {
                    res.status(200).render('campaigns/all-campaigns', {
                        result: campaigns
                    });
                });
        },
        getById(req, res) {
            let campaign = {
                _id: req.params.id,
                title: 'Idea for millions',
                description: 'lorem ipsum dolar sit amet summoning deamons blabalbalbablalb'
            };
            res.status(200).render('campaigns/campaign-details', { campaign });
            // options.data.getCampaignById(req.params.id)
            //     .then(campaign => {
            //         if (campaign === null) {
            //             return res.status(404)
            //                 .redirect('/error');
            //         }

            //         return res.status(200).render('campaigns/campaign-details', {
            //             result: campaign
            //         });
            //     });
        },
        getCreateForm(req, res) {
            return res.status(200).render('campaigns/create-campaign');
        },
        create(req, res) {
            let title = req.body.title;
            let description = req.body.description;
            let createdOn = Date.now();
            let comments = [];
            let creator = req.user;
            let donators = [];
            let upVotes = 0;
            let target = req.body.target;
            let funded = 0;
            let category = req.body.category;

            let gfs = Grid(options.database.connection.db, options.database.mongo);
            let data = options.data;

            gfs.writeFile({}, req.file.buffer, (err, file) => {
                let avatar = file._id;
                let campaign = {
                    title,
                    description,
                    createdOn,
                    comments,
                    creator,
                    donators,
                    upVotes,
                    target,
                    funded,
                    avatar,
                    category
                };

                data.createCampaign(campaign)
                    .then(() => {
                        res.redirect('/home');
                    });
            });

        },
        getByCategory(req, res) {
            let category = req.params.name;
            options.data.findCampaignsByCategory(category)
                .then((campaigns) => {
                    return res.render('campaigns/all-campaigns', {
                        result: campaigns
                    });
                });
        },
        donate(req, res) {
            let campaignId = req.body_id;
            let valueToDonate = +req.body.donationValue;

            options.data.fundCampaign(campaignId, valueToDonate)
                .then(() => {
                    res.send('Campaign Funded');
                });
        }
    };
};