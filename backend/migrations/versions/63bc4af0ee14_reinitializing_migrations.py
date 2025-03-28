"""Reinitializing migrations

Revision ID: 63bc4af0ee14
Revises: 
Create Date: 2025-03-27 18:58:00.503382

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '63bc4af0ee14'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('waste_listing', schema=None) as batch_op:
        batch_op.add_column(sa.Column('farmerName', sa.String(length=255), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('waste_listing', schema=None) as batch_op:
        batch_op.drop_column('farmerName')

    # ### end Alembic commands ###
