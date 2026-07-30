from database import add_zyn, get_wallet


def tap(user_id):
    add_zyn(user_id, 1)

    wallet = get_wallet(user_id)

    if wallet:
        zyn, bttc = wallet
    else:
        zyn, bttc = (0, 0)

    return zyn, bttc
