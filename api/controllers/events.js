const mongoose = require("mongoose");
const Event = mongoose.model("Event");

const allowedCodelists = [
    "name",
    "description",
  ];

  const eventsList = async (req, res) => {
    let nResults = parseInt(req.query.nResults);
    nResults = isNaN(nResults) ? 10 : nResults;
    try {
      let events = await Event.aggregate([
        { $limit: nResults },
      ]);
      if (!events || events.length == 0)
        res.status(404).json({ message: "No events found." });
      else res.status(200).json(events);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }

  };

/*   const eventsList = async (req, res) => {

    try {
  
      let events = await Event.find()
        .limit(10)
        .select('-_id');
  
      if(!events || events.length === 0) {
        return res.status(404).json({message: 'No events found'});
      }
  
      res.status(200).json(events);
  
    } catch (err) {
      res.status(500).json({message: err.message});
    }
  
  }; */


const eventsReadOne = async (req, res) => {
  try {
    let event = await Event.findById(req.params.eventId)
      .select("-id")
      .exec();
    if (!event)
      res.status(404).json({
        message: `Event with id '${req.params.eventId}' not found`,
      });
    else res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const eventsCodelist = async (req, res) => {
    let codelist = req.params.codelist;
    if (!allowedCodelists.includes(codelist))
      res.status(400).json({
        message: `Parameter 'codelist' must be one of: ${allowedCodelists.join(
          ", "
        )}`,
      });
    else {
      try {
        let codeListValues = await Event.distinct(codelist).exec();
        if (!codeListValues || codeListValues.length === 0)
          res
            .status(404)
            .json({ message: `No codelist found for '${codelist}.'` });
        else res.status(200).json(codeListValues);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    }
  };

  const createEvent = async (req, res) => {

    const { name, description, date } = req.body;
  
    try {
  
      const newEvent = new Event({
        name,
        description,
        date,
        signup: [],
      });
  
      await newEvent.save();
  
      res.status(201).json(newEvent);
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' }); 
    }
  
  }

module.exports = {
    eventsList,
    eventsCodelist,
    eventsReadOne,
    createEvent,
  };