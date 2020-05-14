import ShaderLab from "./ShaderLab";
import ShaderMaterial from "./ShaderMaterial";

export const ShaderType = cc.Enum({
    Default: 0,
    Gray: 1,
    GrayScaling: 100,
    Stone: 101,
    Ice: 102,
    Frozen: 103,
    Mirror: 104,
    Poison: 105,
    Banish: 106,
    Vanish: 107,
    Invisible: 108,
    Blur: 109,
    GaussBlur: 110,
    Dissolve: 111,
    Fluxay: 112,
    FluxaySuper: 113,
    Dark: 114,
    ScaleFlip: 115,
    ColorMask: 116,
    RBG: 117,
    BGR: 118,
    BRG: 119,
    GBR: 120,
    GRB: 121,
    HorizonalReelRise: 122,
    HorizonalReelFall: 123,
    VerticalReelRise: 124,
    VerticalReelFall: 125,
    Flip0: 10000,
    Flip1: 10001,
    Flip2: 10002,
    Flip3: 10003,
    Flip4: 10004,
    Flip5: 10005,
    Flip6: 10006,
    Flip7: 10007,
    Flip8: 10008,
    Flip9: 10009,
    Flip10: 10010,
    Flip11: 10011,
    Flip12: 10012,
    Flip13: 10013,
    Flip14: 10014,
    Flip15: 10015,
    Flip16: 10016,
    Flip17: 10017,
    Flip18: 10018,
    Flip19: 10019,
    Flip20: 10020,
    Flip21: 10021,
    Flip22: 10022,
    Flip23: 10023,
    Flip24: 10024,
    Flip25: 10025,
    Flip26: 10026,
    Flip27: 10027,
    Flip28: 10028,
    Flip29: 10029,
    Flip30: 10030,
    Flip31: 10031,
    Flip32: 10032,
    Flip33: 10033,
    Flip34: 10034,
    Flip35: 10035,

});
const ShaderName = {
    '0': 'Default',
    '1': 'Gray',
    '100': 'GrayScaling',
    '101': 'Stone',
    '102': 'Ice',
    '103': 'Frozen',
    '104': 'Mirror',
    '105': 'Poison',
    '106': 'Banish',
    '107': 'Vanish',
    '108': 'Invisible',
    '109': 'Blur',
    '110': 'GaussBlur',
    '111': 'Dissolve',
    '112': 'Fluxay',
    '113': 'FluxaySuper',
    '114': 'Dark',
    '115': 'ScaleFlip',
    '116': 'ColorMask',
    '117': 'RBG',
    '118': 'BGR',
    '119': 'BRG',
    '120': 'GBR',
    '121': 'GRB',
    '122': 'HorizonalReelRise',
    '123': 'HorizonalReelFall',
    '124': 'VerticalReelRise',
    '125': 'VerticalReelFall',
    '10000': 'Flip0',
    '10001': 'Flip1',
    '10002': 'Flip2',
    '10003': 'Flip3',
    '10003': 'Flip3',
    '10004': 'Flip4',
    '10005': 'Flip5',
    '10006': 'Flip6',
    '10007': 'Flip7',
    '10008': 'Flip8',
    '10009': 'Flip9',
    '10010': 'Flip10',
    '10011': 'Flip11',
    '10012': 'Flip12',
    '10013': 'Flip13',
    '10014': 'Flip14',
    '10015': 'Flip15',
    '10016': 'Flip16',
    '10017': 'Flip17',
    '10018': 'Flip18',
    '10019': 'Flip19',
    '10020': 'Flip20',
    '10021': 'Flip21',
    '10022': 'Flip22',
    '10023': 'Flip23',
    '10024': 'Flip24',
    '10025': 'Flip25',
    '10026': 'Flip26',
    '10027': 'Flip27',
    '10028': 'Flip28',
    '10029': 'Flip29',
    '10030': 'Flip30',
    '10031': 'Flip31',
    '10032': 'Flip32',
    '10033': 'Flip33',
    '10034': 'Flip34',
    '10035': 'Flip35',

}

export const ShaderManager = cc.Class({
    statics: {
        useShader(sprite, shader) {
            if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
                console.warn('Shader not surpport for canvas');
                return;
            }
            if (!sprite || !sprite.spriteFrame || sprite.getState() === shader) {
                return;
            }
            if (shader > ShaderType.Gray) {
                let name = ShaderName[shader];
                let lab = ShaderLab[name];
                if (!lab) {
                    console.warn('Shader not defined', name);
                    return;
                }
                cc.dynamicAtlasManager.enabled = false;
                let material = new ShaderMaterial().create(name, lab.vert, lab.frag, lab.defines || []);
                let texture = sprite.spriteFrame.getTexture();
                material.setTexture(texture);
                material.updateHash();
                let sp = sprite;
                sp._material = material;
                sp._renderData._material = material;
                sp._state = shader;

                return material;
            }
            else {
                sprite.setState(shader);
            }
        },
    }
});