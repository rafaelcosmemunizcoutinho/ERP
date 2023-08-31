using MySql.Data.MySqlClient;

namespace cadastro_livro
{
    public partial class Form3 : Form
    {
        MySqlConnection con;
        MySqlDataReader reader;
        private string sql = "";
        private float preco_compra = 0;

        internal static void ActiveForm(Form activeForm)
        {
            throw new NotImplementedException();
        }
        public Form3(MySqlConnection con, MySqlDataReader reader)
        {

            this.con = con;
            this.reader = reader;

            InitializeComponent();

            listViewProdCompra.LabelEdit = true;
            listViewProdCompra.AllowColumnReorder = true;
            listViewProdCompra.FullRowSelect = true;
            listViewProdCompra.GridLines = true;

            listViewFornecedor.LabelEdit = true;
            listViewFornecedor.AllowColumnReorder = true;
            listViewFornecedor.FullRowSelect = true;
            listViewFornecedor.GridLines = true;

            listViewProdAddCompra.LabelEdit = true;
            listViewProdAddCompra.AllowColumnReorder = true;
            listViewProdAddCompra.FullRowSelect = true;
            listViewProdAddCompra.GridLines = true;

            carregaVarsProd(con, reader);
            carregaVarsForne(con, reader);

        }

        private void carregaVarsProd(MySqlConnection con, MySqlDataReader reader)
        {
            try
            {
                if (textBuscaProduto.Text != "")
                    sql = "SELECT pk_id, nome, categoria, tamanho, preco_venda, qtd_estoque FROM distribuidora.produto WHERE nome LIKE'" + textBuscaProduto.Text + "%' AND ativo = '1' ORDER BY nome ASC";

                else
                    sql = "SELECT pk_id, nome, categoria, tamanho, preco_venda, qtd_estoque FROM distribuidora.produto WHERE ativo = '1' ORDER BY nome ASC";

                listViewProdCompra.Items.Clear();

                MySqlCommand comando = new MySqlCommand(sql, con);

                reader = comando.ExecuteReader();

                while (reader.Read())
                {
                    ListViewItem list = new ListViewItem(reader[0].ToString());
                    list.SubItems.Add(reader[1].ToString());
                    list.SubItems.Add(reader[2].ToString());
                    list.SubItems.Add(reader[3].ToString());
                    list.SubItems.Add(reader[4].ToString());
                    list.SubItems.Add(reader[5].ToString());

                    listViewProdCompra.Items.AddRange(new ListViewItem[] { list });
                }

                reader.Close();
            }
            catch (Exception ex)
            {
                Console.WriteLine("The process failed: {0}", ex.ToString());
            }
            finally
            {
                Console.WriteLine("Produto(s) Carregados com sucesso!");
            }
        }
        private void carregaVarsForne(MySqlConnection con, MySqlDataReader reader)
        {
            try
            {
                listViewFornecedor.Items.Clear();

                sql = "SELECT pk_id, nome, representante, fixo, divida, ativo FROM distribuidora.fornecedor WHERE nome != 'anonimo' AND ativo = '1' ORDER BY pk_id ASC";

                MySqlCommand comando = new MySqlCommand(sql, con);

                reader = comando.ExecuteReader();

                while (reader.Read())
                {
                    ListViewItem list = new ListViewItem(reader[0].ToString());
                    list.SubItems.Add(reader[1].ToString());
                    list.SubItems.Add(reader[2].ToString());

                    if (reader[3].ToString() == "True")
                        list.SubItems.Add("Sim");
                    else
                        list.SubItems.Add("Não");

                    list.SubItems.Add(reader[4].ToString());

                    listViewFornecedor.Items.AddRange(new ListViewItem[] { list });
                }

                reader.Close();
            }
            catch (Exception ex)
            {
                Console.WriteLine("The process failed: {0}", ex.ToString());
            }
            finally
            {
                Console.WriteLine("Cliente(s) Carregados com sucesso!");
            }
        }
        private void listViewProdCompra_Click(object sender, EventArgs e)
        {
            try
            {
                quantProdCompra.Enabled = true;
                buttonAddProdCompra.Enabled = true;
            }
            catch (Exception ex)
            {
                Console.WriteLine("The process failed: {0}", ex.ToString());
            }
            finally
            {
                Console.WriteLine("Produto Selecionado com sucesso!");
            }
        }
        private void listViewFornecedor_Click(object sender, EventArgs e)
        {
            try
            {
                textFornecedor.Text = listViewFornecedor.Items[listViewFornecedor.FocusedItem.Index].SubItems[1].Text;
            }
            catch (Exception ex)
            {
                Console.WriteLine("The process failed: {0}", ex.ToString());
            }
            finally
            {
                Console.WriteLine("Cliente Selecionado com sucesso!");
            }
        }
        private void listViewProdAddCompra_Click(object sender, EventArgs e)
        {
            try
            {
                if (buttonRemovProdCompra.Enabled == false)
                    buttonRemovProdCompra.Enabled = true;

            }
            catch (Exception ex)
            {
                Console.WriteLine("The process failed: {0}", ex.ToString());
            }
            finally
            {
                Console.WriteLine("Venda Selecionada com sucesso!");
            }
        }
        private void atualizaPrecoCompra(string operacao)
        {
            try
            {
                if (operacao == "soma")
                {
                    preco_compra += (float)(Convert.ToDouble(quantProdCompra.Value) * float.Parse(listViewProdCompra.Items[listViewProdCompra.FocusedItem.Index].SubItems[4].Text));

                    textPrecoCompra.Text = "R$ " + preco_compra.ToString();

                    Console.WriteLine(listViewProdCompra.Items[listViewProdCompra.FocusedItem.Index].SubItems[3].Text + " X " + listViewProdCompra.Items[listViewProdCompra.FocusedItem.Index].SubItems[1].Text + " Adicionado ao carrinho!");
                }
                else if (operacao == "subtrai")
                {
                    preco_compra -= float.Parse(listViewProdAddCompra.Items[listViewProdAddCompra.FocusedItem.Index].SubItems[5].Text);
                    textPrecoCompra.Text = "R$ " + preco_compra.ToString();

                    Console.WriteLine(listViewProdAddCompra.Items[listViewProdAddCompra.FocusedItem.Index].SubItems[3].Text + " X " + listViewProdAddCompra.Items[listViewProdAddCompra.FocusedItem.Index].SubItems[1].Text + " Removido do carrinho!");
                    listViewProdAddCompra.Items.RemoveAt(listViewProdAddCompra.FocusedItem.Index);

                }

                if (listViewProdAddCompra.Items.Count == 0)
                    buttonRemovProdCompra.Enabled = false;
            }
            catch (Exception ex)
            {
                Console.WriteLine("The process failed: {0}", ex.ToString());
            }
        }
        private void buttonRegistraCompra_Click(object sender, EventArgs e)
        {
            try
            {
                if (textFornecedor.Text == "" || comboTipoCompra.Text == "Select")
                    MessageBox.Show("Selecione o Cliente e(ou) o Tipo da Venda", "Warning", MessageBoxButtons.OK, MessageBoxIcon.Warning);

                else if (listViewProdAddCompra.Items.Count == 0)
                {
                    MessageBox.Show("Selecione Produto(s) para a Venda", "Warning", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                }
                else
                {
                    for (int i = 0; i < listViewProdAddCompra.Items.Count; i++)
                    {
                        if (fornecedor_anonimo.Checked)
                        {
                            sql = "INSERT INTO distribuidora.compra(fk_fornecedor, fk_produto, quantidade, valor, tipo, data_venda)" +
                                "VALUES('" + 1 + "'," +
                                " '" + int.Parse(listViewProdAddCompra.Items[i].SubItems[0].Text) + "'," +
                                " '" + int.Parse(listViewProdAddCompra.Items[i].SubItems[4].Text) + "'," +
                                " '" + float.Parse(listViewProdAddCompra.Items[i].SubItems[5].Text) + "'," +
                                " '" + comboTipoCompra.Text + "'," +
                                " '" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "')";
                        }
                        else
                        {
                            sql = "INSERT INTO distribuidora.compra(fk_fornecedor, fk_produto, quantidade, valor, tipo, data_venda)" +
                                "VALUES('" + int.Parse(listViewFornecedor.Items[listViewFornecedor.FocusedItem.Index].SubItems[0].Text) + "'," +
                                " '" + int.Parse(listViewProdAddCompra.Items[i].SubItems[0].Text) + "'," +
                                " '" + int.Parse(listViewProdAddCompra.Items[i].SubItems[4].Text) + "'," +
                                " '" + float.Parse(listViewProdAddCompra.Items[i].SubItems[5].Text) + "'," +
                                " '" + comboTipoCompra.Text + "'," +
                                " '" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "')";

                        }

                        MySqlCommand comand = new MySqlCommand(sql, con);

                        reader = comand.ExecuteReader();

                        reader.Close();
                    }

                    for (int i = 0; i < listViewProdAddCompra.Items.Count; i++)
                    {
                        sql = "UPDATE distribuidora.produto SET qtd_estoque = qtd_estoque +'" + int.Parse(listViewProdAddCompra.Items[i].SubItems[4].Text) + "'" +
                            "WHERE distribuidora.produto.pk_id = '" + int.Parse(listViewProdAddCompra.Items[i].SubItems[0].Text) + "'";

                        MySqlCommand comando = new MySqlCommand(sql, con);

                        reader = comando.ExecuteReader();

                        reader.Close();
                    }

                    buttonLimparCompra_Click(null, null);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("The process failed: {0}", ex.ToString());
            }
            finally
            {
                MessageBox.Show("Compra Registra!", "Information", MessageBoxButtons.OK, MessageBoxIcon.Information);

                carregaVarsProd(con, reader);
            }
        }
        private void buttonBuscaProd_Click(object sender, EventArgs e)
        {
            carregaVarsProd(con, reader);
        }
        private void buttonAddProdCompra_Click(object sender, EventArgs e)
        {
            try
            {
                if (comboTipoCompra.Enabled == false)
                    comboTipoCompra.Enabled = true;

                if (listViewProdAddCompra.Items.Count == 0)
                    listViewProdAddCompra.Items.Clear();

                if (quantProdCompra.Value > 0)
                {
                    ListViewItem list = new ListViewItem(listViewProdCompra.Items[listViewProdCompra.FocusedItem.Index].SubItems[0].Text);
                    list.SubItems.Add(listViewProdCompra.Items[listViewProdCompra.FocusedItem.Index].SubItems[1].Text);
                    list.SubItems.Add(listViewProdCompra.Items[listViewProdCompra.FocusedItem.Index].SubItems[2].Text);
                    list.SubItems.Add(listViewProdCompra.Items[listViewProdCompra.FocusedItem.Index].SubItems[3].Text);
                    list.SubItems.Add(quantProdCompra.Value.ToString());
                    list.SubItems.Add(((float)(Convert.ToDouble(quantProdCompra.Value) * float.Parse(listViewProdCompra.Items[listViewProdCompra.FocusedItem.Index].SubItems[4].Text))).ToString());

                    listViewProdAddCompra.Items.AddRange(new ListViewItem[] { list });

                    if (buttonRegistraCompra.Enabled == false)
                        buttonRegistraCompra.Enabled = true;

                    atualizaPrecoCompra("soma");

                    quantProdCompra.Value = 0;
                }
                else
                {
                    MessageBox.Show("Selecione a Quantidade!", "Warning", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("The process failed: {0}", ex.ToString());
            }
            finally
            {
                Console.WriteLine("Produto " + listViewProdCompra.Items[listViewProdCompra.FocusedItem.Index].SubItems[1].Text + "adicionado ao carrinho!");
            }
        }
        private void buttonRemovProdCompra_Click(object sender, EventArgs e)
        {
            atualizaPrecoCompra("subtrai");
        }
        private void fornecedor_anonimo_CheckedChanged(object sender, EventArgs e)
        {
            try
            {
                if (fornecedor_anonimo.Checked == true)
                {
                    textFornecedor.Text = "Sem Cadastro";
                    listViewFornecedor.Enabled = false;
                }
                else
                {
                    textFornecedor.Text = "";
                    listViewFornecedor.Enabled = true;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("The process failed: {0}", ex.ToString());
            }
            finally
            {
                Console.WriteLine("Cliente = anonimo");
            }
        }
        private void buttonLimparCompra_Click(object sender, EventArgs e)
        {
            try
            {
                textFornecedor.Text = "";
                comboTipoCompra.Text = "Select";
                textPrecoCompra.Text = "";
                fornecedor_anonimo.Checked = false;
                buttonRemovProdCompra.Enabled = false;
                buttonAddProdCompra.Enabled = false;
                quantProdCompra.Enabled = false;
                buttonLimparCompra.Enabled = false;
                comboTipoCompra.Enabled = false;
                quantProdCompra.Value = 0;

                listViewProdAddCompra.Items.Clear();
            }
            catch (Exception ex)
            {
                Console.WriteLine("The process failed: {0}", ex.ToString());
            }
            finally
            {
                Console.WriteLine("Campos limpos com sucesso!");
            }
        }
    }
}
