const sharp = require('sharp');
const path = require('path');
module.exports = class imageResizer {
    constructor (image, images, cuts = [32,64,128,360, "orig"]) {
        this.image = image
        this.extension = "png"
        this.images = images;
        this.cuts = cuts;
    }

    async resize (size) {
        return await sharp(this.buffer)
            .resize(size)[this.extension]().toBuffer()
    }

    async avatarSizes () {
        await Promise.all(this.cuts.map(async cut => {
            let ext = path.extname(this.image.name)
            let name = this.image.name.replace(ext, "");
            let orgname = name+`__$${cut}__`+ext;
            let _p = basepath + '/storage/temp/' + orgname;
            try {
                if(cut !== "orig") this.images[_p] = await sharp(this.image.data).clone().resize(cut).png().toFile(_p);
                else this.images[_p] = await sharp(this.image.data).clone().png().toFile(_p);
                this.images[_p].key = this.image.key
                this.images[_p].ext = this.image.ext
                this.images[_p].name = orgname
                this.images[_p].path = _p
                this.images[_p].uploaded = false
            } catch (e) {
                console.log(e.message, "@image cut error")
            }
        }))
        return await this.images;
    }

    async imageResize () {
        await Promise.all(this.cuts.map(async cut => {
            let ext = path.extname(this.image.name)
            let name = this.image.name.replace(ext, "");
            let orgname = name+`__$${cut}__`+ext;
            let _p = basepath + '/storage/temp/' + orgname;
            try {
                if(cut !== "orig") this.images[_p] = await sharp(this.image.data).clone().resize(cut).png().toFile(_p);
                else this.images[_p] = await sharp(this.image.data).clone().png().toFile(_p);
                this.images[_p].key = this.image.key
                this.images[_p].ext = this.image.ext
                this.images[_p].name = orgname
                this.images[_p].path = _p
                this.images[_p].uploaded = false
                this.images[_p].mimetype = `image/${this.extension}`;
            } catch (e) {
                console.log(e.message, "@image cut error")
            }
        }))
        return await this.images;
    }


}