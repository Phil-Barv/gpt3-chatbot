import clientPromise from "../../library/mongodb";

export default async function handler(req, res) {
    const client = await clientPromise;
    const db = client.db("cp191");

    switch (req.method) {
      case "POST":
        try {
            // console.log("finojnbtnb")
            let bodyObject = req.body;
            let myPost = await db.collection("surveys").insertOne(bodyObject);
            // console.log("Back", JSON.stringify(bodyObject), JSON.stringify(myPost))
            res.json(myPost);
        } catch (err) {
            console.error(err)
            res.json("Error, try again!")
        }
        break;
      case "GET":
        const allPosts = await db.collection("allPosts").find({}).toArray();
        res.json({ status: 200, data: allPosts });
        break;
    }
  }