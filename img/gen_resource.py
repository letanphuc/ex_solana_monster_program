import datetime
import hashlib
import os
from string import Template

file_template = \
    '''// File is generated at $time
    
    pub struct MonsterType {
        pub range: u16,
        pub hash: [u8; 32],
        pub name: [u8; 32],
    }
    
    pub const MONSTER_TYPES: [MonsterType; $size] = [$monsters
    ];
    '''

monster_template = \
    '''
        // $name
        MonsterType {
            range: $range,
            hash: [$hash],
            name: [$monster_name]
        },'''


def get_name(name):
    b = ['0x%02x' % ord(c) for c in name]
    b += ['0x20'] * (32 - len(b))
    return ', '.join(b)


def gen_output(resource):
    monsters = ''.join(Template(monster_template).substitute(
        range=int(100 / (2 ** (i + 1)) * 100),
        hash=item['data'],
        name=item['name'],
        monster_name=get_name(item['name'])
    ) for i, item in enumerate(resource))

    with open('../programs/basic-1/src/resource.rs', 'w') as f:
        f.write(Template(file_template).substitute(
            monsters=monsters,
            size=len(resource),
            time=datetime.datetime.now()))


def gen_resource():
    resource = []
    dir_name = './resource'
    for file in os.listdir(dir_name):
        d = open(os.path.join(dir_name, file), 'rb').read()
        m = hashlib.sha256()
        m.update(d)
        m.hexdigest()
        m.digest()

        resource.append(
            {
                'name': file.split('.')[0],
                'data': ', '.join(['0x%02x' % d for d in m.digest()])
            }
        )
    return resource


if __name__ == '__main__':
    r = gen_resource()
    gen_output(r)
