goog.require("SoundFont.WebMidiLink");

/** @define {boolean} */
var SF2_REVERB_EXPORT = false;

if (SF2_REVERB_EXPORT) {
    goog.exportSymbol("SoundFont.Reverb", SoundFont.Reverb);
    goog.exportSymbol(
        "SoundFont.Reverb.prototype.connect",
        SoundFont.Reverb.prototype.connect
    );
    goog.exportSymbol(
        "SoundFont.Reverb.prototype.disconnect",
        SoundFont.Reverb.prototype.disconnect
    );
    goog.exportSymbol(
        "SoundFont.Reverb.prototype.time",
        SoundFont.Reverb.prototype.time
    );
    goog.exportSymbol(
        "SoundFont.Reverb.prototype.decay",
        SoundFont.Reverb.prototype.decay
    );
    goog.exportSymbol(
        "SoundFont.Reverb.prototype.delay",
        SoundFont.Reverb.prototype.delay
    );
    goog.exportSymbol(
        "SoundFont.Reverb.prototype.cutOff",
        SoundFont.Reverb.prototype.cutOff
    );
    goog.exportSymbol(
        "SoundFont.Reverb.prototype.type",
        SoundFont.Reverb.prototype.type
    );
}