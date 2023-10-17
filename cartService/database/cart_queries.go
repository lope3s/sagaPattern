package database

import "context"

const DROP_CART_QUERY = `DELETE FROM cart WHERE id = $1;`

type DropCartParams struct {
    ID int
}

func (d *Queries) DropCart(ctx context.Context, params DropCartParams) error {
    _, err := d.db.ExecContext(ctx, DROP_CART_QUERY, params.ID) 

    if err != nil {
        return err
    }

    return nil
}

const ADD_CART_ITEM_QUERY = `INSERT INTO cart (product_id, product_amount)
VALUES ($1, $2)
RETURNING id, product_id, product_amount, created_at, deleted_at;
`

type AddCartItemParams struct {
    ProductID int
    ProductAmount int
}

func  (d *Queries) AddCartItem(ctx context.Context, params AddCartItemParams) (Cart, error) {
    row := d.db.QueryRowContext(
        ctx,
        ADD_CART_ITEM_QUERY,
        params.ProductID,
        params.ProductAmount,
    )

    var data Cart
    err := row.Scan(
        &data.ID,
        &data.PoductID,
        &data.ProductAmount,
        &data.CreatedAt,
        &data.DeletedAt,
    )

    return data, err
}
